import { Card, CardContent, Typography } from "@mui/material";

interface StatCardProps {
  title: string;
  value: string;
}

const StatCard = ({ title, value }: StatCardProps) => (
  <Card>
    <CardContent>
      <Typography color="textSecondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h5">{value}</Typography>
    </CardContent>
  </Card>
);

export default StatCard;
