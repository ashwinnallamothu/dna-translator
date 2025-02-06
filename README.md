# DNA/RNA to Protein Translator

An interactive web application for translating DNA/RNA sequences to proteins with real-time visualization and analysis features.

## Features

- **DNA/RNA Translation**: Convert DNA sequences to RNA and then to amino acid sequences
- **Bidirectional Input**: Accept both DNA and RNA input sequences
- **Reading Frame Selection**: Analyze sequences in all three reading frames
- **Color-Coded Visualization**: Track codons and their corresponding amino acids
- **Multiple Notation Systems**: Switch between one-letter and three-letter amino acid codes
- **Sequence Analysis**: GC content calculation and sequence statistics
- **Sample Sequences**: Pre-loaded with biologically relevant sequences

## Built With

- React
- Vite
- Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository
   ```sh
   git clone https://github.com/your-username/dna-translator.git
   ```

2. Install NPM packages
   ```sh
   cd dna-translator
   npm install
   ```

3. Start the development server
   ```sh
   npm run dev
   ```

### Sample Sequences

The application comes with several pre-loaded sequences:
- Insulin Signal Peptide
- GFP Chromophore
- Kozak Sequence

## Usage

1. Choose your input type (DNA or RNA)
2. Enter a sequence or select a sample
3. Choose reading frame and amino acid notation
4. View the translated sequence and analysis

## Project Structure

```
dna-translator/
├── src/
│   ├── components/
│   │   └── DNATranslator.jsx
│   ├── globals.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── postcss.config.js
└── tailwind.config.js
```

## Development

To contribute to this project:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

