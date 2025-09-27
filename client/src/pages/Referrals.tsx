import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Copy, Users, Star, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { ReferralStats } from "@shared/schema";

export default function Referrals() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  // Mock user ID - in real app this would come from authentication
  const userId = "user-123";

  // Fetch referral stats from API
  const { data: referralStats, isLoading } = useQuery<ReferralStats>({
    queryKey: ['/api/referrals/stats', userId],
    queryFn: () => fetch(`/api/referrals/stats/${userId}`).then(res => res.json()),
  });

  // Claim rewards mutation
  const claimMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/referrals/claim/${userId}`),
    onSuccess: (data) => {
      console.log("Claim successful:", data);
      queryClient.invalidateQueries({ queryKey: ['/api/referrals/stats', userId] });
      toast({
        title: "Rewards claimed!",
        description: `${referralStats?.claimableRewards || 0} tTRUST added to your account`,
      });
    },
    onError: (error) => {
      console.error("Claim error:", error);
      toast({
        title: "Error",
        description: "Failed to claim rewards. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCopyLink = () => {
    if (referralStats?.referralLink) {
      navigator.clipboard.writeText(referralStats.referralLink);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Share this link to earn tTRUST rewards",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClaimRewards = () => {
    claimMutation.mutate();
  };

  // Calculate progress to next milestone
  const nextMilestone = !referralStats ? 3 : 
    referralStats.totalReferrals >= 10 ? Math.ceil((referralStats.totalReferrals + 1) / 10) * 10 : 
    (referralStats.totalReferrals >= 3 ? 10 : 3);
  const progress = !referralStats ? 0 : (referralStats.totalReferrals / nextMilestone) * 100;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background overflow-auto p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading referral data...</p>
        </div>
      </div>
    );
  }

  if (!referralStats) {
    return (
      <div className="min-h-screen bg-background overflow-auto p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Unable to load referral data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-auto p-6" data-testid="referrals-page">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Referral Program</h1>
          <p className="text-muted-foreground">
            Invite friends to QUESTFLOW and earn tTRUST rewards together
          </p>
        </div>

        {/* Referral Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card data-testid="total-referrals">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Referrals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-500" />
                <div className="text-2xl font-bold">{referralStats.totalReferrals}</div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Friends joined</p>
            </CardContent>
          </Card>

          <Card data-testid="total-earnings">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Earned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <div className="text-2xl font-bold">{referralStats.totalEarned} tTRUST</div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Lifetime rewards</p>
            </CardContent>
          </Card>

          <Card data-testid="claimable-rewards">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Claimable</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Gift className="w-5 h-5 text-green-500" />
                <div className="text-2xl font-bold">{referralStats.claimableRewards} tTRUST</div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Ready to claim</p>
            </CardContent>
          </Card>
        </div>

        {/* Referral Link */}
        <Card data-testid="referral-link-card">
          <CardHeader>
            <CardTitle>Your Referral Link</CardTitle>
            <p className="text-sm text-muted-foreground">
              Share this link with friends to start earning rewards
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Input 
                value={referralStats.referralLink} 
                readOnly 
                className="flex-1"
                data-testid="input-referral-link"
              />
              <Button 
                onClick={handleCopyLink}
                variant="outline"
                data-testid="button-copy-link"
              >
                <Copy className="w-4 h-4 mr-2" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reward Milestones */}
        <Card data-testid="reward-milestones">
          <CardHeader>
            <CardTitle>Reward Milestones</CardTitle>
            <p className="text-sm text-muted-foreground">
              Earn more tTRUST as you refer more friends
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress to {nextMilestone} referrals</span>
                <span>{referralStats.totalReferrals} / {nextMilestone}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Milestone List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">3 Referrals</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">1 tTRUST</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {referralStats.totalReferrals >= 3 ? "✅ Completed" : "Get your first reward"}
                </p>
              </div>

              <div className="bg-muted/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">10 Referrals</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium">1.5 tTRUST</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {referralStats.totalReferrals >= 10 ? "✅ Completed" : "Bonus reward tier"}
                </p>
              </div>
            </div>

            {/* Claim Button */}
            {referralStats.claimableRewards > 0 && (
              <Button 
                onClick={handleClaimRewards}
                className="w-full"
                data-testid="button-claim-rewards"
                disabled={claimMutation.isPending}
              >
                <Gift className="w-4 h-4 mr-2" />
                {claimMutation.isPending ? "Claiming..." : `Claim ${referralStats.claimableRewards} tTRUST`}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* How it Works */}
        <Card data-testid="how-it-works">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">1</span>
                </div>
                <h4 className="font-semibold">Share Your Link</h4>
                <p className="text-sm text-muted-foreground">
                  Send your unique referral link to friends and family
                </p>
              </div>

              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">2</span>
                </div>
                <h4 className="font-semibold">They Join</h4>
                <p className="text-sm text-muted-foreground">
                  Your friends sign up and start their QUESTFLOW journey
                </p>
              </div>

              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl font-bold text-purple-600 dark:text-purple-400">3</span>
                </div>
                <h4 className="font-semibold">Earn Rewards</h4>
                <p className="text-sm text-muted-foreground">
                  Get tTRUST rewards when you hit referral milestones
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}