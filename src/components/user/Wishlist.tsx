import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WishlistProps } from "@/types/component.types";

export const Wishlist: React.FC<WishlistProps> = ({ user }) => {
    const navigate = useNavigate();

    return (
        <Card className="animate-fade-in animation-delay-400">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Wishlist</CardTitle>
                        <CardDescription>
                            {user.wishlist.length} saved items
                        </CardDescription>
                    </div>
                    <Heart className="h-5 w-5 text-red-500" />
                </div>
            </CardHeader>
            <CardContent>
                {user.wishlist.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                        {user.wishlist.map(item => (
                            <div
                                key={item.id}
                                className="group relative overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md"
                            >
                                <div className="aspect-video overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={`Item ${item.id}`}
                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-3">
                                    <p className="text-xs text-muted-foreground">ID: {item.id}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex h-32 flex-col items-center justify-center rounded-md border border-dashed bg-muted/50">
                        <Heart className="mb-2 h-10 w-10 text-muted-foreground/40" />
                        <p className="text-sm text-muted-foreground">
                            Your wishlist is empty
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Save items you like for later
                        </p>
                    </div>
                )}

                <div className="mt-6 flex justify-end">
                    <Button onClick={() => navigate("/wishlist")}>
                        View Full Wishlist
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default Wishlist;
