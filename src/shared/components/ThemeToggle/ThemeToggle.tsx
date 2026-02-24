import { Button } from "@/shared/components/ui";
import { useTheme } from "@/core/theme";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button variant="outline" size="sm" onClick={toggleTheme}>
      Theme: {theme}
    </Button>
  );
};