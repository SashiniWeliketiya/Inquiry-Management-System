const db = require('../config/db');

const VALID_TRANSITIONS = {
  'New': ['In Progress'],
  'In Progress': ['Resolved', 'New'],
  'Resolved': ['In Progress']
};

exports.getInquiries = async (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM inquiries';
    const params = [];

    if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';
    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
};

exports.createInquiry = async (req, res) => {
  const { customer_name, contact_info, subject, description } = req.body;

  if (!customer_name || !contact_info || !subject || !description) {
    return res.status(422).json({ error: 'All fields are required.' });
  }

  try {
    const query = `
      INSERT INTO inquiries (customer_name, contact_info, subject, description, status)
      VALUES ($1, $2, $3, $4, 'New')
      RETURNING *;
    `;
    const values = [customer_name, contact_info, subject, description];
    const { rows } = await db.query(query, values);
    
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create inquiry' });
  }
};

exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status: newStatus } = req.body;

  try {
    const inquiryRes = await db.query('SELECT * FROM inquiries WHERE id = $1', [id]);
    if (inquiryRes.rows.length === 0) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    const currentStatus = inquiryRes.rows[0].status;
    const allowed = VALID_TRANSITIONS[currentStatus] || [];
    
    if (!allowed.includes(newStatus)) {
      return res.status(400).json({ 
        error: `Cannot transition status directly from '${currentStatus}' to '${newStatus}'.` 
      });
    }

    const updateQuery = `
      UPDATE inquiries 
      SET status = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2 
      RETURNING *;
    `;
    const updated = await db.query(updateQuery, [newStatus, id]);
    res.json(updated.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
};


exports.deleteInquiry = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM inquiries WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    res.json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete inquiry' });
  }
};