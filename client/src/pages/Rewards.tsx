import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Gift, TrendingUp, Zap } from "lucide-react";

export default function Rewards() {
  const [userEarnings] = useState({
    staking: "0",
    incentives: "0", 
    campaigns: "0",
    liquid: "0"
  });

  const [userStats] = useState({
    tier: 0, // Current tier index
    stakedAmount: 0,
    nextTierTarget: 4500,
    liquidRewardRate: 0
  });

  const tierNames = ["Enchanter", "Illuminated", "Oracle", "Templar"];
  const getCurrentTierIndex = () => {
    if (userStats.stakedAmount >= 22500) return 3; // Templar
    if (userStats.stakedAmount >= 15500) return 2; // Oracle  
    if (userStats.stakedAmount >= 9000) return 1; // Illuminated
    return 0; // Enchanter
  };

  const rewardTiers = [
    { rate: 0, requirement: "Enchanter", questsRequired: 0 },
    { rate: 10, requirement: "Illuminated", questsRequired: 50 },
    { rate: 25, requirement: "Conscious", questsRequired: 150 },
    { rate: 50, requirement: "Oracle", questsRequired: 300 },
    { rate: 100, requirement: "Templar", questsRequired: 500 },
  ];


  return (
    <div className="min-h-screen bg-background overflow-auto p-6" data-testid="rewards-page">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Your earnings on QUESTFLOW</h1>
          <div className="text-2xl font-bold text-foreground">0 tTRUST</div>
        </div>

        {/* Earnings Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card data-testid="card-incentives">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">QF Incentives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userEarnings.incentives} tTRUST</div>
            </CardContent>
          </Card>
          
          <Card data-testid="card-campaigns">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userEarnings.campaigns} tTRUST</div>
            </CardContent>
          </Card>

          <Card data-testid="card-quest-earnings">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Quest Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userEarnings.liquid} tTRUST</div>
            </CardContent>
          </Card>
        </div>

        {/* Liquid Rewards Section */}
        <Card className="p-6" data-testid="quest-earnings-section">
          <h2 className="text-2xl font-bold text-foreground mb-4">Quest Earnings</h2>
          <p className="text-muted-foreground mb-6">
            With each quest you complete, you earn tTRUST
          </p>

          {/* Reward Rate Tiers */}
          <div className="space-y-3 mb-6">
            <div className="text-sm font-medium text-muted-foreground mb-3">Quest Earning Rate</div>
            {rewardTiers.map((tier, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  userStats.liquidRewardRate === tier.rate 
                    ? 'bg-primary/10 border-primary' 
                    : 'bg-muted/20 border-border'
                }`}
                data-testid={`reward-tier-${tier.rate}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-lg font-bold">{tier.rate}%</div>
                  <div className="text-sm text-muted-foreground">{tier.requirement}</div>
                </div>
                {userStats.liquidRewardRate === tier.rate && (
                  <Badge variant="default">Current</Badge>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Season Status */}
        <Card className="p-6" data-testid="season-status">
          <div className="text-center">
            <h3 className="text-xl font-bold text-foreground mb-2">Season 1 Active</h3>
            <p className="text-muted-foreground mb-4">
              Complete quests and earn tTRUST rewards. Your progress is tracked automatically.
            </p>
            <div className="flex justify-center items-center space-x-4 mb-4">
              <div className="text-3xl font-bold">0</div>
              <div className="text-sm text-muted-foreground">Your Progress</div>
            </div>
          </div>
        </Card>

        {/* User Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* League Card */}
          <Card className="p-6" data-testid="league-card">
            <h3 className="text-lg font-bold text-foreground mb-4">Your Tier</h3>
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white text-2xl font-bold">{tierNames[userStats.tier][0]}</span>
              </div>
              <div className="text-xl font-bold">{tierNames[userStats.tier]}</div>
              <div className="text-sm text-muted-foreground mt-1">Tier {userStats.tier + 1} of 4</div>
            </div>
          </Card>

          {/* Quest Progress */}
          <Card className="p-6" data-testid="quest-progress">
            <h3 className="text-lg font-bold text-foreground mb-4">Quest Progress</h3>
            <div className="space-y-4">
              <div className="text-2xl font-bold">47 Quests Completed</div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Next Tier</span>
                  <span>47 / 50 quests</span>
                </div>
                <Progress 
                  value={(47 / 50) * 100} 
                  className="h-2"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Liquid Rewards Summary */}
        <Card className="p-6" data-testid="quest-earnings-summary">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-bold text-foreground">Your Quest Earnings</h3>
              <div className="text-2xl font-bold mt-2">0 tTRUST</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Quest Earning Rate</div>
              <div className="text-lg font-bold">{userStats.liquidRewardRate}%</div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Button variant="outline" className="w-full" data-testid="button-view-progress">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Progress
            </Button>
          </div>
        </Card>


      </div>
    </div>
  );
}