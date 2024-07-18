import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { cn } from "../lib/utils";

type CardLayoutProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
};

const CardLayout = ({ title, description, children, className }: CardLayoutProps) => {
  return (
    <Card className={cn('px-6 py-2 max-w-lg w-full', className)}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      {children}
    </Card>
  );
};

export default CardLayout;
