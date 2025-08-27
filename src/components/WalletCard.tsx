import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Plus, History } from "lucide-react";
import { useState } from "react";

interface WalletCardProps {
  balance: number;
  currency?: string;
  onTopUp?: () => void;
  onViewHistory?: () => void;
}

export const WalletCard = ({ 
  balance, 
  currency = "₹", 
  onTopUp, 
  onViewHistory 
}: WalletCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleTopUp = async () => {
    if (!onTopUp) return;
    setIsLoading(true);
    try {
      await onTopUp();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-primary shadow-soft border-0">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-primary-foreground">
          <Wallet className="w-5 h-5" />
          Wallet Balance
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary-foreground">
            {currency}{balance.toFixed(2)}
          </div>
          <p className="text-sm text-primary-foreground/80 mt-1">
            Available Balance
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={handleTopUp}
            disabled={isLoading}
          >
            <Plus className="w-4 h-4" />
            {isLoading ? "Processing..." : "Top Up"}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onViewHistory}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <History className="w-4 h-4" />
          </Button>
        </div>
        
        {balance < 50 && (
          <div className="text-xs text-primary-foreground/80 text-center p-2 bg-primary-foreground/10 rounded-lg">
            💡 Low balance! Top up to continue learning.
          </div>
        )}
      </CardContent>
    </Card>
  );
};