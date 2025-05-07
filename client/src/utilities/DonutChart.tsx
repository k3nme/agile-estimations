import {
  BarChart,
  Bar,
  XAxis,
  ResponsiveContainer,
  YAxis,
  LabelList,
} from "recharts";
import type Issue from "../../../models/Issue";

interface DataProps {
  selectedIssue: Issue;
}

const SimpleBarChart = ({ selectedIssue }: DataProps) => {
  const data = Object.keys(selectedIssue.estimations).map((key) => {
    return {
      type: key,
      votes: selectedIssue.estimations[key].length,
    };
  });

  return (
    <ResponsiveContainer width="100%">
      <BarChart data={data} margin={{ top: 50, right: 0, left: 0, bottom: 50 }}>
        <XAxis
          dataKey="type"
          axisLine={false}
          tickMargin={15}
          tickLine={false}
          tick={{ fill: "#000", fontWeight: 800 }}
          ticks={data.map((entry) => entry.type)}
        />
        <YAxis
          dataKey="votes"
          axisLine={false}
          tickLine={false}
          tick={false}
          ticks={data.map((entry) => entry.votes)}
        />
        <Bar dataKey="votes" fill="#4c51bf" barSize={30} radius={5}>
          <LabelList dataKey="votes" position="center" fill="#fff" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SimpleBarChart;
