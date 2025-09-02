"use client";

import { Star } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { useCart } from "@/src/hooks/useCart";
import Image from "next/image";

export default function RecommendationCard(recommendation: any) {
  const { product, reason } = recommendation;
  const { addToCart } = useCart();
  return (
    <Card className="group hover:shadow-lg pt-0 transition-all duration-300 hover:-translate-y-1 border-amber-200 bg-gradient-to-br from-amber-50/50 to-orange-50/50">
      {product.imageUrl && (
        <div className="w-full h-48 overflow-hidden rounded-t-lg">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={"100"}
            height={"48"}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      <CardHeader className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            <Star className="h-3 w-3 mr-1 fill-current" />
            Recommended
          </Badge>
        </div>
        <CardTitle className="text-xl text-balance">{product.name}</CardTitle>
        <CardDescription className="text-pretty leading-relaxed min-h-[50px]">
          {product.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 min-h-[120px]">
        <div className="text-2xl font-bold">${product.price}</div>
        <Alert className="border-amber-200 bg-amber-50">
          <AlertDescription className="text-amber-800">
            <span className="font-medium">Why we recommend: </span>
            {reason}
          </AlertDescription>
        </Alert>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          onClick={() => addToCart(product)}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
          size="lg"
        >
          Add to Order
        </Button>
      </CardFooter>
    </Card>
  );
}
