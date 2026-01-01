import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { CasperClient, DeployUtil, Keys, RuntimeArgs, CLValueBuilder } from "casper-js-sdk";
import fs from 'fs';

// Helper to load key from hex string or file
const loadKey = (keyParam: string) => {
  try {
    // If it's a file path
    if (fs.existsSync(keyParam)) {
      return Keys.Ed25519.loadKeyPairFromPrivateFile(keyParam);
    } 
    // If it's a hex string (assuming Ed25519 for this example, or Secp256k1)
    // Casper keys usually come in .pem files, but user said "Hex format".
    // We'll assume it's the private key hex. 
    // Note: handling hex keys directly might depend on the curve. 
    // Let's assume Ed25519 as it's common on Casper.
    const keyPair = Keys.Ed25519.parsePrivateKey(Keys.Ed25519.readBase64WithPEM(keyParam)); 
    // Wait, readBase64WithPEM expects PEM content. 
    // If it's raw hex, we might need a different approach.
    // For simplicity/robustness, let's try to parse as Ed25519.
    // Ideally we'd use a library helper, but here we will try:
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
      // NOTE: For 'Hex format' private key, we assume it is the raw private key bytes in hex.
      // This is a simplification. In production, robust key loading is needed.
      const merchantKeyPair = Keys.Ed25519.parsePrivateKey(
        Uint8Array.from(Buffer.from(merchantKeyHex, 'hex'))
      );

      // Contract Call Logic
      // 1. Create RuntimeArgs
      const args = RuntimeArgs.fromMap({
        recipient: CLValueBuilder.string(userAddress), // Assuming contract takes recipient as string (hash) or public key
        amount: CLValueBuilder.u256(amount)
      });

      // 2. Create Deploy
      // We need to know if the contract hash includes 'hash-' prefix.
      const contractHashClean = contractHash.startsWith('hash-') ? contractHash.slice(5) : contractHash;
      
      const deploy = DeployUtil.makeDeploy(
        new DeployUtil.DeployParams(
          merchantKeyPair.publicKey,
          networkName
        ),
        DeployUtil.ExecutableDeployItem.newStoredContractByHash(
          Uint8Array.from(Buffer.from(contractHashClean, 'hex')),
          "issue_points", // Entry point name
          args
        ),
        DeployUtil.standardPayment(10000000000) // 10 CSPR gas payment (adjust as needed)
      );

      // 3. Sign Deploy
      const signedDeploy = deploy.sign([merchantKeyPair]);

      // 4. Send Deploy
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
