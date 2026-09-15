const express = require('express');
const router = express.Router();
const supabase = require('../db');

// 1. Major 코드 목록 조회
router.get('/major', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('major_code')
            .select('major_code, major_name, remark, use_yn')
            .order('major_code', { ascending: true });

        if (error) throw error;
        res.json({ success: true, data });
    } catch (err) {
        console.error('Major 조회 오류:', err.message);
        res.status(500).json({ success: false, message: 'Major 코드 조회 실패: ' + err.message });
    }
});

// 2. Minor 코드 목록 조회
router.get('/minor', async (req, res) => {
    const { major_code } = req.query;

    if (!major_code) {
        return res.json({ success: true, data: [] });
    }

    try {
        const { data, error } = await supabase
            .from('minor_code')
            .select('major_code, minor_code, minor_name, sort_order, remark, use_yn')
            .eq('major_code', major_code)
            .order('sort_order', { ascending: true })
            .order('minor_code', { ascending: true });

        if (error) throw error;

        const mappedData = (data || []).map(item => ({
            ...item,
            sort_seq: item.sort_order
        }));

        res.json({ success: true, data: mappedData });
    } catch (err) {
        console.error('Minor 조회 오류:', err.message);
        res.status(500).json({ success: false, message: 'Minor 코드 조회 실패: ' + err.message });
    }
});

// 3. Major 코드 통합 저장 (remark 반영)
router.post('/major/save', async (req, res) => {
    const { items } = req.body;
    
    if (!items || items.length === 0) {
        return res.json({ success: true, message: '저장할 변경 사항이 없습니다.' });
    }

    try {
        for (const item of items) {
            const { status, major_code, major_name, remark, use_yn } = item;

            if (status === 'I') {
                const { error } = await supabase
                    .from('major_code')
                    .insert({ 
                        major_code, 
                        major_name, 
                        remark,
                        use_yn 
                    });

                if (error) throw error;

            } else if (status === 'U') {
                const { error } = await supabase
                    .from('major_code')
                    .update({ 
                        major_name, 
                        remark,
                        use_yn, 
                        update_dt: new Date().toISOString() 
                    })
                    .eq('major_code', major_code);

                if (error) throw error;

            } else if (status === 'D') {
                const { error } = await supabase
                    .from('major_code')
                    .delete()
                    .eq('major_code', major_code);

                if (error) throw error;
            }
        }

        res.json({ success: true, message: 'Major 코드가 성공적으로 저장되었습니다.' });
    } catch (err) {
        console.error('Major 저장 오류:', err.message);
        res.status(500).json({ success: false, message: 'Major 코드 저장 오류: ' + err.message });
    }
});

// 4. Minor 코드 통합 저장 (remark 반영)
router.post('/minor/save', async (req, res) => {
    const { items } = req.body;
    
    if (!items || items.length === 0) {
        return res.json({ success: true, message: '저장할 변경 사항이 없습니다.' });
    }

    try {
        for (const item of items) {
            const { status, major_code, minor_code, minor_name, remark, sort_seq, use_yn } = item;

            if (status === 'I') {
                const { error } = await supabase
                    .from('minor_code')
                    .insert({ 
                        major_code, 
                        minor_code, 
                        minor_name, 
                        remark,
                        sort_order: sort_seq, 
                        use_yn 
                    });

                if (error) throw error;

            } else if (status === 'U') {
                const { error } = await supabase
                    .from('minor_code')
                    .update({ 
                        minor_name, 
                        remark,
                        sort_order: sort_seq, 
                        use_yn, 
                        update_dt: new Date().toISOString() 
                    })
                    .eq('major_code', major_code)
                    .eq('minor_code', minor_code);

                if (error) throw error;

            } else if (status === 'D') {
                const { error } = await supabase
                    .from('minor_code')
                    .delete()
                    .eq('major_code', major_code)
                    .eq('minor_code', minor_code);

                if (error) throw error;
            }
        }

        res.json({ success: true, message: 'Minor 코드가 성공적으로 저장되었습니다.' });
    } catch (err) {
        console.error('Minor 저장 오류:', err.message);
        res.status(500).json({ success: false, message: 'Minor 코드 저장 오류: ' + err.message });
    }
});

module.exports = router;