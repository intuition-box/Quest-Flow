import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

interface Campaign {
  id: string;
  title: string;
  description: string;
  projectName: string;
  projectLogo: string;
  participantCount: number;
  startDate: string;
  endDate: string;
  isLive: boolean;
  rewardPool?: {
    amount: string;
    token: string;
  };
  heroImage: string;
}

interface HeroCampaignProps {
  campaigns: Campaign[];
}

export default function HeroCampaign({ campaigns }: HeroCampaignProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [, setLocation] = useLocation();
  const currentCampaign = campaigns[currentIndex];

  const handleCampaignClick = () => {
    if (currentCampaign) {
      setLocation(`/campaign/${currentCampaign.id}`);
    }
  };

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
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    const time = date.toLocaleDateString('en-US', { 
      hour: 'numeric',
      minute: '2-digit'
    });
    return { month, day, time };
  };

  const nextCampaign = () => {
    setCurrentIndex((prev) => (prev + 1) % campaigns.length);
  };

  const prevCampaign = () => {
    setCurrentIndex((prev) => (prev - 1 + campaigns.length) % campaigns.length);
  };

  if (!currentCampaign) return null;

  const startDate = formatDate(currentCampaign.startDate);
  const endDate = formatDate(currentCampaign.endDate);

  return (
    <div 
      className="relative h-96 bg-gradient-to-br from-purple-900/50 via-purple-800/30 to-blue-900/50 rounded-2xl overflow-hidden mb-8 cursor-pointer hover:scale-[1.02] transition-transform duration-200"
      onClick={handleCampaignClick}
      data-testid="hero-campaign-card"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${currentCampaign.heroImage})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/60 via-transparent to-transparent" />

      {/* Navigation Arrows */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          prevCampaign();
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center transition-colors"
        data-testid="button-prev-campaign"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          nextCampaign();
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center transition-colors"
        data-testid="button-next-campaign"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      <div className="relative h-full flex items-center">
        <div className="flex-1 p-8">
          {/* Participant Count */}
          <div className="text-white/80 text-sm mb-2">
            {formatParticipants(currentCampaign.participantCount)}
          </div>

          {/* Campaign Label */}
          <div className="text-white/60 text-sm mb-2">Campaign</div>
          
          {/* Title */}
          <h1 className="text-4xl font-bold text-white mb-4">{currentCampaign.title}</h1>
          
          {/* Description */}
          <p className="text-white/80 text-lg mb-6 max-w-md">{currentCampaign.description}</p>

          {/* Date and Status */}
          <div className="flex items-center space-x-6 mb-6">
            <div className="flex items-center space-x-2">
              <div className="text-center">
                <div className="text-white font-bold text-lg">{startDate.month}</div>
                <div className="text-white font-bold text-2xl">{startDate.day}</div>
              </div>
              <div className="text-white/60 text-sm">
                <div>{startDate.time}</div>
                <div>to {endDate.time}</div>
              </div>
            </div>
            
            {currentCampaign.isLive && (
              <Badge className="bg-green-500 text-white">
                <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                Live
              </Badge>
            )}
          </div>

          {/* Reward Pool */}
          {currentCampaign.rewardPool && (
            <div className="flex items-center space-x-2">
              <span className="text-white/60">Total Rewards Pool</span>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">T</span>
                </div>
                <span className="text-white font-bold text-lg">
                  {currentCampaign.rewardPool.amount} {currentCampaign.rewardPool.token}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 3D Hexagonal Logo Display */}
        <div className="flex-shrink-0 pr-8">
          <div className="relative">
            {/* 3D Hexagonal Base */}
            <div className="relative w-48 h-48">
              {/* Base hexagon */}
              <div className="absolute inset-0 transform perspective-1000 rotate-x-20">
                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 clip-hexagon transform-3d"></div>
              </div>
              
              {/* Top hexagon */}
              <div className="absolute inset-4 transform perspective-1000 rotate-x-20 translate-y-2">
                <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 clip-hexagon transform-3d"></div>
              </div>
              
              {/* Project Logo */}
              <div className="absolute inset-8 flex items-center justify-center">
                <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center border-4 border-white/20">
                  <img 
                    src={currentCampaign.projectLogo} 
                    alt={currentCampaign.projectName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {campaigns.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(index);
            }}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/40'
            }`}
            data-testid={`pagination-dot-${index}`}
          />
        ))}
      </div>
    </div>
  );
}