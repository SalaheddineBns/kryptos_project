import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", value: 400 },
  { name: "Fév", value: 800 },
  { name: "Mar", value: 600 },
];

const Chart = () => (
  <LineChart width={600} height={300} data={data}>
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Line type="monotone" dataKey="value" stroke="#3f51b5" />
  </LineChart>
);

export default Chart;
