import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type IssuePointsResponse } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

// POST /api/issue-points
export function useIssuePoints() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ userAddress, amount }: { userAddress: string; amount: number }) => {
      // Using fetch instead of axios to reduce bundle size, but axios was installed as requested
      const validatedInput = api.casper.issuePoints.input.parse({ userAddress, amount });
      
      const res = await fetch(api.casper.issuePoints.path, {
        method: api.casper.issuePoints.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedInput),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.casper.issuePoints.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        if (res.status === 500) {
          const error = api.casper.issuePoints.responses[500].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error('Failed to issue points');
      }

      return api.casper.issuePoints.responses[200].parse(await res.json());
    },
    onSuccess: (data: IssuePointsResponse) => {
      toast({
        title: "Points Issued Successfully",
        description: `Deploy Hash: ${data.deployHash?.slice(0, 10)}...${data.deployHash?.slice(-10)}`,
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Transaction Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
