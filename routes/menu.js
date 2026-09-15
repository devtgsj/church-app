// routes/menu.js
const express = require('express');
const router = express.Router();
const supabase = require('../db');

// 메뉴 목록 조회
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('menus')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });

        if (error) throw error;
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;