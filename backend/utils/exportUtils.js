import PDFDocument from 'pdfkit';
import Result from '../models/Result.js';
import Vote from '../models/Vote.js';

// Helper function to escape CSV fields
const escapeCSV = (field) => {
  if (field === null || field === undefined) return '';
  const str = String(field);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

// Export results as CSV
export const exportResultsCSV = async (res) => {
  try {
    const results = await Result.find()
      .populate('winner', 'name department year')
      .sort({ post: 1 });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=election-results.csv');

    // Write CSV header
    const header = 'Post,Winner Name,Department,Year,Total Votes,Announced,Announced At\n';
    res.write(header);

    // Write CSV rows
    results.forEach(result => {
      const row = [
        escapeCSV(result.post),
        escapeCSV(result.winnerName || 'Not Announced'),
        escapeCSV(result.winnerDepartment || '-'),
        escapeCSV(result.winnerYear || '-'),
        escapeCSV(result.totalVotes),
        escapeCSV(result.announced ? 'Yes' : 'No'),
        escapeCSV(result.announcedAt ? result.announcedAt.toISOString() : '-')
      ].join(',') + '\n';
      res.write(row);
    });

    res.end();
  } catch (error) {
    throw error;
  }
};

// Export results as PDF
export const exportResultsPDF = async (res) => {
  try {
    const results = await Result.find()
      .populate('winner', 'name department year manifesto')
      .sort({ post: 1 });

    const doc = new PDFDocument();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=election-results.pdf');
    
    doc.pipe(res);

    // Header
    doc.fontSize(20).text('M-Bytes Forum Election Results', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.moveDown(2);

    // Results
    results.forEach((result, index) => {
      doc.fontSize(16).text(`${index + 1}. ${result.post}`, { underline: true });
      doc.moveDown(0.5);
      
      if (result.announced && result.winner) {
        doc.fontSize(12).text(`Winner: ${result.winnerName}`);
        doc.text(`Department: ${result.winnerDepartment}`);
        doc.text(`Year: ${result.winnerYear}`);
        doc.text(`Total Votes: ${result.totalVotes}`);
        doc.text(`Announced: ${result.announcedAt.toLocaleString()}`);
      } else {
        doc.fontSize(12).text('Result not announced yet');
      }
      
      doc.moveDown(1.5);
    });

    doc.end();
  } catch (error) {
    throw error;
  }
};

// Export detailed votes as CSV
export const exportVotesCSV = async (res) => {
  try {
    const votes = await Vote.find()
      .populate('user', 'name email studentId')
      .populate('candidate', 'name post')
      .sort({ votedAt: -1 });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=election-votes.csv');

    // Write CSV header
    const header = 'Voter Name,Voter Email,Student ID,Post,Candidate Name,Voted At\n';
    res.write(header);

    // Write CSV rows
    votes.forEach(vote => {
      const row = [
        escapeCSV(vote.user.name),
        escapeCSV(vote.user.email),
        escapeCSV(vote.user.studentId || '-'),
        escapeCSV(vote.post),
        escapeCSV(vote.candidate.name),
        escapeCSV(vote.votedAt.toISOString())
      ].join(',') + '\n';
      res.write(row);
    });

    res.end();
  } catch (error) {
    throw error;
  }
};

