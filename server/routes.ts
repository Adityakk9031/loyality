import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import CasperSDK from "casper-js-sdk";
import fs from 'fs';

// Destructure from default export for compatibility
const { CasperClient, DeployUtil, Keys, RuntimeArgs, CLValueBuilder } = CasperSDK;

// Helper to load key from hex string or file
const loadKey = (keyParam: string) => {
  try {
    if (fs.existsSync(keyParam)) {
      return Keys.Ed25519.loadKeyPairFromPrivateFile(keyParam);
    } 
    const privateKey = Uint8Array.from(Buffer.from(keyParam, 'hex'));
    return Keys.Ed25519.parsePrivateKey(privateKey);
  } catch (e) {
    console.error("Failed to load key:", e);
    throw new Error("Invalid MERCHANT_PRIVATE_KEY");
  }
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post(api.casper.issuePoints.path, async (req, res) => {
    try {
      const { userAddress, amount } = api.casper.issuePoints.input.parse(req.body);

      const nodeAddress = process.env.NODE_ADDRESS;
      const networkName = process.env.NETWORK_NAME;
      const contractHash = process.env.CONTRACT_HASH;
      const merchantKeyHex = process.env.MERCHANT_PRIVATE_KEY;

      if (!nodeAddress || !networkName || !contractHash || !merchantKeyHex) {
        throw new Error("Missing backend configuration (Secrets)");
      }

      const client = new CasperClient(nodeAddress);

      // Prepare keys
      const merchantKeyPair = Keys.Ed25519.parsePrivateKey(
        Uint8Array.from(Buffer.from(merchantKeyHex, 'hex'))
      );

      // Contract Call Logic
      const args = RuntimeArgs.fromMap({
        recipient: CLValueBuilder.string(userAddress),
        amount: CLValueBuilder.u256(amount)
      });

      // Create Deploy
      const contractHashClean = contractHash.startsWith('hash-') ? contractHash.slice(5) : contractHash;
      
      const deploy = DeployUtil.makeDeploy(
        new DeployUtil.DeployParams(
          merchantKeyPair.publicKey,
          networkName
        ),
        DeployUtil.ExecutableDeployItem.newStoredContractByHash(
          Uint8Array.from(Buffer.from(contractHashClean, 'hex')),
          "issue_points",
          args
        ),
        DeployUtil.standardPayment(10000000000)
      );

      // Sign Deploy
      const signedDeploy = deploy.sign([merchantKeyPair]);

      // Send Deploy
      const deployHash = await client.putDeploy(signedDeploy);

      res.status(200).json({
        success: true,
        deployHash: deployHash,
        message: "Points issued successfully. Transaction pending."
      });

    } catch (err) {
      console.error("Issue points error:", err);
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: (err as Error).message || "Internal Server Error" });
    }
  });

  return httpServer;
}
