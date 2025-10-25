"use client";

import { useState, useRef, useCallback } from "react";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import useMouse from "@react-hook/mouse-position";

// Circuit parameters
const FIXED_VOLTAGE = 10; // V
const PULSE_DURATION = 0.01; // s
const PULSE_WIDTH = 0.005; // s
const TIME_STEP = 0.0001; // s
const TOTAL_TIME = 0.021; // s (increased to show full waveform after delay)
const DELAY_TIME = 0.001; // s (1ms delay before applying voltage)

type DataPoint = {
  time: number;
  inputVoltage: number;
  reactanceVoltage: number;
  resistanceVoltage: number;
};

export default function RLCircuitSimulator() {
  const [resistance, setResistance] = useState(100); // ohms
  const [reactance, setReactance] = useState(100); // ohms
  const chartRef = useRef<HTMLDivElement>(null);
  const mouse = useMouse(chartRef, {
    enterDelay: 100,
    leaveDelay: 100,
  });

  const simulateCircuit = useCallback((): DataPoint[] => {
    const data: DataPoint[] = [];
    let current = 0;
    const inductance = reactance / (2 * Math.PI * 50); // Assuming 50 Hz frequency

    for (let t = 0; t <= TOTAL_TIME; t += TIME_STEP) {
      const inputVoltage =
        t < DELAY_TIME
          ? 0
          : t < PULSE_DURATION + DELAY_TIME
          ? t < PULSE_WIDTH + DELAY_TIME
            ? FIXED_VOLTAGE
            : 0
          : 0;
      const resistanceVoltage = current * resistance;
      const reactanceVoltage = inputVoltage - resistanceVoltage;

      data.push({
        time: t,
        inputVoltage,
        reactanceVoltage,
        resistanceVoltage,
      });

      // Update current for the next iteration
      const didt = (inputVoltage - resistanceVoltage) / inductance;
      current += didt * TIME_STEP;
    }

    return data;
  }, [resistance, reactance]);

  const circuitData = simulateCircuit();

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>RL Circuit Simulator</CardTitle>
        <CardDescription>
          Adjust resistance and reactance to see how the circuit behaves
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="resistance" className="text-sm font-medium">
              Resistance: {resistance} Ω
            </label>
            <Slider
              id="resistance"
              min={1}
              max={1000}
              step={1}
              value={[resistance]}
              onValueChange={(values) => setResistance(values[0])}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="reactance" className="text-sm font-medium">
              Reactance: {reactance} Ω
            </label>
            <Slider
              id="reactance"
              min={1}
              max={1000}
              step={1}
              value={[reactance]}
              onValueChange={(values) => setReactance(values[0])}
            />
          </div>
          <div className="h-[400px]" ref={chartRef}>
            <ChartContainer
              config={{
                inputVoltage: {
                  label: "Input Voltage",
                  color: "hsl(0, 100%, 50%)", // Red
                },
                reactanceVoltage: {
                  label: "Reactance Voltage",
                  color: "hsl(120, 100%, 25%)", // Green
                },
                resistanceVoltage: {
                  label: "Resistance Voltage",
                  color: "hsl(240, 100%, 50%)", // Blue
                },
              }}
            >
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={circuitData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="time"
                    type="number"
                    scale="linear"
                    domain={[0, TOTAL_TIME]}
                    tickFormatter={(value) => value.toFixed(3)}
                    label={{
                      value: "Time (s)",
                      position: "insideBottomRight",
                      offset: -5,
                    }}
                  />
                  <YAxis
                    label={{
                      value: "Voltage (V)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                    domain={[-FIXED_VOLTAGE, FIXED_VOLTAGE]}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={{
                      stroke: "var(--foreground)",
                      strokeWidth: 1,
                      strokeDasharray: "4 4",
                    }}
                  />
                  <Legend />
                  <Line
                    type="linear"
                    dataKey="inputVoltage"
                    stroke="hsl(0, 100%, 50%)"
                    dot={false}
                    strokeWidth={2}
                  />
                  <Line
                    type="linear"
                    dataKey="reactanceVoltage"
                    stroke="hsl(120, 100%, 25%)"
                    dot={false}
                    strokeWidth={2}
                  />
                  <Line
                    type="linear"
                    dataKey="resistanceVoltage"
                    stroke="hsl(240, 100%, 60%)"
                    dot={false}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className="text-sm text-muted-foreground h-6">
            Time:{" "}
            {mouse.x !== null
              ? (
                  (mouse.x / chartRef.current!.clientWidth) *
                  TOTAL_TIME
                ).toFixed(5)
              : "N/A"}{" "}
            s
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
