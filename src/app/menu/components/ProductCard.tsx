"use client";

import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/src/components/ui/card";
import { useCart } from "@/src/hooks/useCart";

export default function ProductCard(product: any) {
  const { addToCart } = useCart();
  return (
    <Card className="group pt-0 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {product.imageUrl && (
        <div className="w-full h-48 overflow-hidden rounded-t-lg">
          <Image
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            width={300}
            height={200}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      <CardHeader>
        <CardTitle className="text-xl text-balance">{product.name}</CardTitle>
        <CardDescription className="text-pretty leading-relaxed min-h-[50px]">
          {product.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="min-h-[20px]" />

      <CardFooter className="pt-0 flex items-center gap-4">
        <div className="flex-shrink-0 w-1/6 p-2 bg-gray-100 rounded text-center font-bold text-lg">
          ${product.price}
        </div>
        <Button
          onClick={() => addToCart(product)}
          className="flex-1 w-5/6"
          size="lg"
        >
          Add to Order
        </Button>
      </CardFooter>
    </Card>
  );
}
