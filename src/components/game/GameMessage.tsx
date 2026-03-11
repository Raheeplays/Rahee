import { Badge } from "@/components/ui/badge";

type GameMessageProps = {
  message: string;
};

export default function GameMessage({ message }: GameMessageProps) {
    return (
        <div key={message} className="w-full max-w-md mx-auto my-2 text-center animate-in fade-in duration-500">
             <Badge variant="outline" className="text-sm px-4 py-2 bg-background/80 backdrop-blur-sm">
                {message}
             </Badge>
        </div>
    )
}
