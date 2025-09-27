import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

interface CampaignCardProps {
  title: string;
  projectName: string;
  projectLogo: string;
  heroImage: string;
  participantCount: number;
  startDate: string;
  endDate: string;
  isLive?: boolean;
  rewardPool?: {
    amount: string;
    token: string;
  };
  campaignId?: string;
  from?: string;
}

export default function CampaignCard({
  title,
  projectName,
  projectLogo,
  heroImage,
  participantCount,
  startDate,
  endDate,
  isLive = true,
  rewardPool,
  campaignId,
  from
}: CampaignCardProps) {
  const [, setLocation] = useLocation();
  const formatParticipants = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const handleClick = () => {
    if (campaignId && isLive) {
      const url = from ? `/campaign/${campaignId}?from=${from}` : `/campaign/${campaignId}`;
      setLocation(url);
    }
  };

  return (
    <Card 
      className="overflow-hidden hover-elevate cursor-pointer group relative" 
      onClick={handleClick}
      data-testid={`campaign-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {/* Hero Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={heroImage} 
          alt={title}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Participant Count Overlay */}
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1">
          <span className="text-white font-bold">{formatParticipants(participantCount)}</span>
        </div>

        {/* Status Badge */}
        <div className="absolute bottom-4 right-4">
          <Badge 
            variant={isLive ? "default" : "secondary"}
            className={isLive ? "bg-green-500 text-white" : "bg-gray-500 text-white"}
          >
            {isLive ? "Live" : "Ended"}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Project Info */}
        <div className="flex items-center space-x-2 mb-3">
          <img 
            src={projectLogo} 
            alt={projectName}
            className="w-6 h-6 rounded-full"
          />
          <span className="text-sm text-muted-foreground">{projectName}</span>
        </div>
        
        <h3 className="text-lg font-bold text-card-foreground mb-4">{title}</h3>

        {/* Date Range */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="text-center">
            <div className="text-sm font-bold text-card-foreground">
              {formatDate(startDate).split(',')[0].split(' ')[0]}
            </div>
            <div className="text-lg font-bold text-card-foreground">
              {formatDate(startDate).split(' ')[1]}
            </div>
          </div>
          <div className="flex-1 text-xs text-muted-foreground">
            <div>{formatDate(startDate)}</div>
            <div>to {formatDate(endDate)}</div>
          </div>
        </div>

        {/* Reward Pool */}
        {rewardPool && (
          <div className="border-t border-card-border pt-4">
            <div className="text-sm text-muted-foreground mb-1">Rewards</div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-500 font-bold">5XP</span>
              <span className="text-muted-foreground">+</span>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span className="font-bold text-card-foreground">{rewardPool.amount} {rewardPool.token}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}