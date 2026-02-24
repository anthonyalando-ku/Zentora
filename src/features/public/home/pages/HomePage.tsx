import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { Card, Heading } from "@/shared/components/ui";
import { CenteredLayout } from "@/shared/layouts";

const HomePage = () => {
  return (
    <CenteredLayout>
      <Card>
        <Heading>Public Home Page</Heading>
        <ThemeToggle />
      </Card>
    </CenteredLayout>
  );
};

export default HomePage;