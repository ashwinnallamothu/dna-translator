import React, { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Type definitions
interface ProcessedCodon {
  codon: string;
  aminoAcid: string | null;
  colorClass: string;
}

interface Props {
  sequence: string;
  processedSequence: ProcessedCodon[];
}

interface Motif {
  name: string;
  positions: number[];
}

interface GCData {
  position: number;
  gcContent: number;
}

interface HydrophobicityData {
  position: number;
  hydrophobicity: number;
}

export const hydrophobicityScale: Record<string, number> = {
  'I': 4.5, 'V': 4.2, 'L': 3.8, 'F': 2.8, 'C': 2.5, 'M': 1.9, 'A': 1.8,
  'G': -0.4, 'T': -0.7, 'S': -0.8, 'W': -0.9, 'Y': -1.3, 'P': -1.6,
  'H': -3.2, 'E': -3.5, 'Q': -3.5, 'D': -3.5, 'N': -3.5, 'K': -3.9, 'R': -4.5
};

export const SequenceAnalysisTools: React.FC<Props> = ({ 
  sequence, 
  processedSequence 
}) => {
  // Find DNA motifs
  const findMotifs = (seq: string): Motif[] => {
    const motifs: Record<string, string> = {
      'TATA Box': 'TATAAA',
      'Kozak Sequence': 'GCCACC',
      'Splice Donor': 'GT',
      'Splice Acceptor': 'AG'
    };

    return Object.entries(motifs).map(([name, pattern]) => ({
      name,
      positions: [...seq.matchAll(new RegExp(pattern, 'g'))].map(m => m.index ?? -1)
    }));
  };

  // Calculate GC content in sliding windows
  const calculateGCWindow = (seq: string, windowSize: number = 10): GCData[] => {
    const gcData: GCData[] = [];
    for (let i = 0; i <= seq.length - windowSize; i++) {
      const window = seq.slice(i, i + windowSize);
      const gcCount = (window.match(/[GC]/g) || []).length;
      gcData.push({
        position: i + 1,
        gcContent: (gcCount / windowSize) * 100
      });
    }
    return gcData;
  };

  // Calculate hydrophobicity for amino acid sequence
  const calculateHydrophobicity = (processedSeq: ProcessedCodon[]): HydrophobicityData[] => {
    // Filter valid amino acids and convert to one-letter code if needed
    return processedSeq
      .filter(item => item.aminoAcid && item.aminoAcid !== 'STOP')
      .map((item, index) => {
        // Convert three-letter code to one-letter code if needed
        const aa = item.aminoAcid || '';
        const oneLetter = aa.length === 3 ? convertToOneLetter(aa) : aa;
        
        return {
          position: index + 1,
          hydrophobicity: hydrophobicityScale[oneLetter] || 0
        };
      });
  };

  // Helper function to convert three-letter codes to one-letter codes
  const convertToOneLetter = (threeLetter: string): string => {
    const converter: Record<string, string> = {
      'Ala': 'A', 'Arg': 'R', 'Asn': 'N', 'Asp': 'D', 'Cys': 'C',
      'Glu': 'E', 'Gln': 'Q', 'Gly': 'G', 'His': 'H', 'Ile': 'I',
      'Leu': 'L', 'Lys': 'K', 'Met': 'M', 'Phe': 'F', 'Pro': 'P',
      'Ser': 'S', 'Thr': 'T', 'Trp': 'W', 'Tyr': 'Y', 'Val': 'V'
    };
    return converter[threeLetter] || threeLetter;
  };

  // Memoize calculations
  const motifs = useMemo(() => findMotifs(sequence), [sequence]);
  const gcData = useMemo(() => calculateGCWindow(sequence), [sequence]);
  const hydrophobicityData = useMemo(
    () => calculateHydrophobicity(processedSequence),
    [processedSequence]
  );

  return (
    <Tabs defaultValue="hydrophobicity" className="w-full">
      <TabsList className="w-full justify-start">
        <TabsTrigger value="hydrophobicity">Hydrophobicity Plot</TabsTrigger>
        <TabsTrigger value="gc">GC Content</TabsTrigger>
        <TabsTrigger value="motifs">Sequence Motifs</TabsTrigger>
      </TabsList>

      <TabsContent value="hydrophobicity">
        <div className="h-64 w-full">
          {hydrophobicityData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hydrophobicityData}>
                <XAxis 
                  dataKey="position" 
                  label={{ value: "Amino Acid Position", position: "bottom" }} 
                />
                <YAxis 
                  domain={[-4.5, 4.5]}
                  label={{ value: "Hydrophobicity", angle: -90, position: "insideLeft" }} 
                />
                <Tooltip 
                  formatter={(value: number) => [value.toFixed(2), "Hydrophobicity"]}
                />
                <Line 
                  type="monotone" 
                  dataKey="hydrophobicity" 
                  stroke="#8884d8"
                  dot={true}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              No valid amino acid sequence available for hydrophobicity analysis
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="gc">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={gcData}>
              <XAxis 
                dataKey="position" 
                label={{ value: "Sequence Position", position: "bottom" }} 
              />
              <YAxis 
                label={{ value: "GC Content (%)", angle: -90, position: "insideLeft" }} 
              />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="gcContent" 
                stroke="#82ca9d"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>

      <TabsContent value="motifs">
        <div className="space-y-2">
          {motifs.map(({ name, positions }) => (
            <div key={name} className="flex items-center space-x-2">
              <span className="font-medium min-w-32">{name}:</span>
              <span className="text-sm">
                {positions.length > 0 
                  ? `Found at positions: ${positions.join(', ')}` 
                  : 'Not found'}
              </span>
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};