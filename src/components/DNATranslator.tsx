"use client"
import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SequenceAnalysisTools } from './SequenceAnalysisTools';

// Type definitions
type InputType = 'dna' | 'rna';
type NotationType = 'one' | 'three';
type AminoAcid = [string, string]; // [three letter code, one letter code]

interface CodonTable {
  [key: string]: AminoAcid;
}

interface DnaToRna {
  [key: string]: string;
}

interface SampleSequence {
  seq: string;
  desc: string;
}

interface SampleSequences {
  [key: string]: SampleSequence;
}

interface ProcessedCodon {
  codon: string;
  aminoAcid: string | null;
  colorClass: string;
}

interface SequenceAnalysis {
  length: number;
  gcContent: string;
  codonCounts: {
    [key: string]: number;
  };
}

const DNATranslator: React.FC = () => {
  const [input, setInput] = useState<string>('ATGGCCCTGAAGATCGCACAATAG');
  const [inputType, setInputType] = useState<InputType>('dna');
  const [notation, setNotation] = useState<NotationType>('three');
  const [frame, setFrame] = useState<number>(0);

  // Codon tables with both 3-letter and 1-letter codes
  const codonTable: CodonTable = {
    'UUU': ['Phe', 'F'], 'UUC': ['Phe', 'F'], 'UUA': ['Leu', 'L'], 'UUG': ['Leu', 'L'],
    'UCU': ['Ser', 'S'], 'UCC': ['Ser', 'S'], 'UCA': ['Ser', 'S'], 'UCG': ['Ser', 'S'],
    'UAU': ['Tyr', 'Y'], 'UAC': ['Tyr', 'Y'], 'UAA': ['STOP', '*'], 'UAG': ['STOP', '*'],
    'UGU': ['Cys', 'C'], 'UGC': ['Cys', 'C'], 'UGA': ['STOP', '*'], 'UGG': ['Trp', 'W'],
    'CUU': ['Leu', 'L'], 'CUC': ['Leu', 'L'], 'CUA': ['Leu', 'L'], 'CUG': ['Leu', 'L'],
    'CCU': ['Pro', 'P'], 'CCC': ['Pro', 'P'], 'CCA': ['Pro', 'P'], 'CCG': ['Pro', 'P'],
    'CAU': ['His', 'H'], 'CAC': ['His', 'H'], 'CAA': ['Gln', 'Q'], 'CAG': ['Gln', 'Q'],
    'CGU': ['Arg', 'R'], 'CGC': ['Arg', 'R'], 'CGA': ['Arg', 'R'], 'CGG': ['Arg', 'R'],
    'AUU': ['Ile', 'I'], 'AUC': ['Ile', 'I'], 'AUA': ['Ile', 'I'], 'AUG': ['Met', 'M'],
    'ACU': ['Thr', 'T'], 'ACC': ['Thr', 'T'], 'ACA': ['Thr', 'T'], 'ACG': ['Thr', 'T'],
    'AAU': ['Asn', 'N'], 'AAC': ['Asn', 'N'], 'AAA': ['Lys', 'K'], 'AAG': ['Lys', 'K'],
    'AGU': ['Ser', 'S'], 'AGC': ['Ser', 'S'], 'AGA': ['Arg', 'R'], 'AGG': ['Arg', 'R'],
    'GUU': ['Val', 'V'], 'GUC': ['Val', 'V'], 'GUA': ['Val', 'V'], 'GUG': ['Val', 'V'],
    'GCU': ['Ala', 'A'], 'GCC': ['Ala', 'A'], 'GCA': ['Ala', 'A'], 'GCG': ['Ala', 'A'],
    'GAU': ['Asp', 'D'], 'GAC': ['Asp', 'D'], 'GAA': ['Glu', 'E'], 'GAG': ['Glu', 'E'],
    'GGU': ['Gly', 'G'], 'GGC': ['Gly', 'G'], 'GGA': ['Gly', 'G'], 'GGG': ['Gly', 'G']
  };

  const dnaToRna: DnaToRna = {
    'A': 'U', 'T': 'A', 'G': 'C', 'C': 'G'
  };

  // Extended sample sequences
  const sampleSequences: SampleSequences = {
    'Insulin Signal Peptide': {
      seq: 'ATGGCCCTGAAGATCGCACAATAG',
      desc: 'Human insulin secretory signal - directs protein to secretory pathway'
    },
    'GFP Chromophore': {
      seq: 'TGTTATGGTGTTCAATGCTTTGCAAGATATCCAGACAAC',
      desc: 'Region coding for GFP fluorescent center'
    },
    'Kozak Sequence': {
      seq: 'GCCACCATGGCCCAG',
      desc: 'Strong Kozak consensus for translation initiation'
    },
    'BRCA1 Mutation Site': {
      seq: 'ATGCTGAGTTTGTGTGTGAACGGACACTG',
      desc: 'Common mutation region in breast cancer gene'
    }
  };

  const codonColors: string[] = [
    'bg-blue-100', 'bg-green-100', 'bg-yellow-100', 
    'bg-red-100', 'bg-purple-100', 'bg-pink-100',
    'bg-indigo-100', 'bg-orange-100'
  ];

  const transcribe = (dna: string): string => {
    return dna.toUpperCase().split('').map(base => dnaToRna[base] || base).join('');
  };

  const processSequence = (sequence: string, readingFrame: number = 0): ProcessedCodon[] => {
    const rnaSeq = inputType === 'dna' ? transcribe(sequence) : sequence;
    const offsetSeq = rnaSeq.slice(readingFrame);
    const codons = offsetSeq.match(/.{1,3}/g) || [];
    
    return codons.map((codon, index) => {
      const aminoAcid = codonTable[codon];
      return {
        codon,
        aminoAcid: aminoAcid ? aminoAcid[notation === 'three' ? 0 : 1] : null,
        colorClass: codonColors[index % codonColors.length]
      };
    });
  };

  const analyzeSequence = (sequence: string): SequenceAnalysis => {
    const rnaSeq = inputType === 'dna' ? transcribe(sequence) : sequence;
    const codons = rnaSeq.match(/.{1,3}/g) || [];
    
    const gcCount = (rnaSeq.match(/[GC]/g) || []).length;
    const gcContent = ((gcCount / rnaSeq.length) * 100).toFixed(1);
    
    const codonCounts: { [key: string]: number } = {};
    codons.forEach(codon => {
      if (codonTable[codon]) {
        const aa = codonTable[codon][0];
        codonCounts[aa] = (codonCounts[aa] || 0) + 1;
      }
    });

    return {
      length: sequence.length,
      gcContent,
      codonCounts
    };
  };

  const processedSequence = useMemo(() => 
    processSequence(input, parseInt(String(frame))), [input, inputType, notation, frame]);
  
  const analysis = useMemo(() => 
    analyzeSequence(input), [input, inputType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^ATCGU]/g, '');
    setInput(value);
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Enhanced DNA/RNA to Protein Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Controls */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Input Type:</label>
              <select 
                className="w-full p-2 border rounded"
                value={inputType}
                onChange={(e) => setInputType(e.target.value as InputType)}
              >
                <option value="dna">DNA</option>
                <option value="rna">RNA</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Reading Frame:</label>
              <select 
                className="w-full p-2 border rounded"
                value={frame}
                onChange={(e) => setFrame(parseInt(e.target.value))}
              >
                <option value="0">Frame 1 (+0)</option>
                <option value="1">Frame 2 (+1)</option>
                <option value="2">Frame 3 (+2)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Amino Acid Notation:</label>
              <select 
                className="w-full p-2 border rounded"
                value={notation}
                onChange={(e) => setNotation(e.target.value as NotationType)}
              >
                <option value="three">Three Letter (Met, Leu, etc)</option>
                <option value="one">One Letter (M, L, etc)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Sample Sequences:</label>
              <select 
                className="w-full p-2 border rounded"
                onChange={(e) => {
                  const selected = sampleSequences[e.target.value];
                  if (selected) {
                    setInput(selected.seq);
                    setInputType('dna');
                  }
                }}
              >
                <option value="">Select a sample sequence...</option>
                {Object.entries(sampleSequences).map(([name, data]) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sequence Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Sequence:</label>
            <textarea
              className="w-full p-2 border rounded font-mono"
              rows={3}
              value={input}
              onChange={handleInputChange}
              placeholder={`Enter ${inputType.toUpperCase()} sequence...`}
            />
          </div>

          {/* Sequence Information */}
          {input && (
            <Alert>
              <AlertTitle>Sequence Analysis</AlertTitle>
              <AlertDescription>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div>
                    <div className="text-sm font-medium">Length</div>
                    <div>{analysis.length} bases</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">GC Content</div>
                    <div>{analysis.gcContent}%</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Codons</div>
                    <div>{Math.floor(analysis.length / 3)}</div>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Results */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">RNA Sequence (color-coded by codon):</label>
              <div className="flex flex-wrap gap-1 p-2 bg-gray-50 rounded">
                {processedSequence.map((item, index) => (
                  <span 
                    key={index}
                    className={`${item.colorClass} px-1 py-0.5 rounded font-mono`}
                    title={`Codon ${index + 1}: ${item.codon} → ${item.aminoAcid || 'STOP'}`}
                  >
                    {item.codon}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Protein Sequence:</label>
              <div className="flex flex-wrap gap-1 p-2 bg-gray-50 rounded">
                {processedSequence.map((item, index) => {
                  if (!item.aminoAcid || item.aminoAcid === 'STOP') return null;
                  return (
                    <span 
                      key={index}
                      className={`${item.colorClass} px-1 py-0.5 rounded font-mono`}
                      title={`From codon: ${item.codon}`}
                    >
                      {item.aminoAcid}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Codon Usage */}
            <div>
              <label className="block text-sm font-medium mb-2">Amino Acid Usage:</label>
              <div className="grid grid-cols-4 gap-2 p-2 bg-gray-50 rounded text-sm">
                {Object.entries(analysis.codonCounts).map(([aa, count]) => (
                  <div key={aa} className="flex justify-between">
                    <span className="font-mono">{aa}:</span>
                    <span>{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Advanced Analysis Tools */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Advanced Sequence Analysis</h3>
              <SequenceAnalysisTools
                sequence={input}
                processedSequence={processedSequence}
              />
            </div>
          </div>

          {/* Help Text */}
          <div className="text-sm text-gray-600 space-y-1">
            <p>* Hover over codons and amino acids to see their relationships</p>
            <p>* Use different reading frames to find alternative open reading frames</p>
            <p>* All sequences are automatically cleaned of invalid characters</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DNATranslator;