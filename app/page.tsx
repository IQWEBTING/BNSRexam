'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, AlertCircle, Loader2, LogIn } from 'lucide-react';
import { useExamStore } from '@/store/useExamStore';

const mcqQuestions = [
  {
    id: 'q1',
    text: 'ข้อ 1) ลูกค้าแจ้งว่าได้รับสินค้าไม่ครบหลังการซื้อขายเสร็จสิ้นแล้ว คุณจะจัดการอย่างไร?',
    options: [
      '1.1 ขอตรวจสอบหลักฐานและรับผิดชอบในความผิดพลาดที่เกิดขึ้น',
      '1.2 บล็อกแชทและเพิกเฉยต่อลูกค้า',
      '1.3 โยนเรื่องให้แอดมินจัดการแทน'
    ]
  },
  {
    id: 'q2',
    text: 'ข้อ 2) ลูกค้าสอบถามเรื่องความน่าเชื่อถือของร้าน แต่ร้านเพิ่งเปิดใหม่ยังไม่มีเครดิตสะสม คุณจะใช้อะไรยืนยันตัวเองในเบื้องต้น?',
    options: [
      '2.1 ใบรายงานผลการตรวจสอบ',
      '2.2 ใบรับรองแพทย์',
      '2.3 เพิกเฉยและต่อว่าลูกค้าที่ไม่ไว้วางใจ'
    ]
  },
  {
    id: 'q3',
    text: 'ข้อ 3) ลูกค้าสนใจสินค้าและถามว่าสามารถ "เทรด" ได้ไหม (รับสินค้าก่อน จ่ายทีหลัง) คุณควรปรึกษาใคร?',
    options: [
      '3.1 เพื่อนหรือคนใกล้ชิด',
      '3.2 ตัดสินใจด้วยตัวเองโดยใช้วิจารณญาณของตนเอง',
      '3.3 ต่อว่าและบล็อกลูกค้าทันที',
      '3.4 อื่นๆ'
    ],
    hasOther: true
  },
  {
    id: 'q4',
    text: 'ข้อ 4) เกิดความขัดแย้งขึ้นเพราะลูกค้าไม่พอใจ เช่น นายเอ บอกว่าราคาของคุณแพงกว่าร้านอื่น คุณจะรับมืออย่างไร?',
    options: [
      '4.1 อธิบายอย่างละเอียดและมีเหตุผลให้นายเอเข้าใจถึงความแตกต่าง',
      '4.2 ต่อว่าและบล็อกนายเอทันที',
      '4.3 ลดราคาจนเท่าทุนเพื่อให้ขายได้'
    ]
  },
  {
    id: 'q5',
    text: 'ข้อ 5) ลูกค้าสั่งซื้อสินค้าของคุณในปริมาณมากมาย คุณจะทำอย่างไร?',
    options: [
      '5.1 "บิดแล้วรวย ซวยแล้วมึง"',
      '5.2 ไปเติมน้ำมัน',
      '5.3 ขอบคุณลูกค้าอย่างจริงใจและมอบของแถมเล็กน้อยเพื่อแสดงความซาบซึ้ง',
      '5.4 ขอเป็นแฟน'
    ]
  }
];

const essayQuestions = [
  {
    id: 'q6',
    text: 'ข้อ 6) หากคุณมีโอกาสโกงลูกค้า คุณจะทำหรือไม่? เพราะอะไร?'
  },
  {
    id: 'q7',
    text: 'ข้อ 7) หากยังไม่มีลูกค้าเข้ามาใช้บริการเลย คุณจะมีวิธีหาลูกค้าอย่างไร?'
  },
  {
    id: 'q8',
    text: 'ข้อ 8) คุณจะรับมืออย่างไรเมื่อเจอลูกค้าที่มีนิสัยไม่ดีหรือพฤติกรรมที่ยากจะรับมือ?'
  },
  {
    id: 'q9',
    text: 'ข้อ 9) หากลูกค้าต้องการตรวจสอบสินค้าก่อนตัดสินใจ คุณจะอนุญาตหรือไม่? อย่างไร?'
  },
  {
    id: 'q10',
    text: 'ข้อ 10) คุณมีเหตุผลและเจตนาอะไรในการเปิดขายสินค้า และคุณพร้อมรับมือกับสถานการณ์ทั้งหมดที่กล่าวมาในข้อ 1–9 ได้จริงหรือไม่?'
  }
];

const submitToGoogleSheets = async (action: string, data: any) => {
  const scriptUrl = 'https://script.google.com/macros/s/AKfycbzwVeZ_3pPKSTdxpHUIKCH2q4-LrBGXehY7ZY156D2ZxU_PpuNlqox2LfNUJB4VBSqZEQ/exec';

  try {
    // ใช้ text/plain เพื่อหลีกเลี่ยงปัญหา CORS Preflight ของ Google Apps Script
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({ action, ...data }),
    });

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'รหัสไม่ถูกต้อง หรือไม่พบในระบบ');
    }
    
    return result;
  } catch (error: any) {
    console.error('Error communicating with Google Sheets:', error);
    // ส่งต่อ Error message ที่ได้จาก Apps Script (ถ้ามี)
    if (error.message && !error.message.includes('JSON') && error.message !== 'Failed to fetch') {
      throw error;
    }
    throw new Error('เกิดข้อผิดพลาดในการเชื่อมต่อ หรือรหัสไม่ถูกต้อง');
  }
};

export default function ExamApp() {
  const { 
    bnsrCode, isAuthenticated, isSuccess
  } = useExamStore();

  if (isSuccess) {
    return <SuccessView />;
  }

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 sticky top-0 z-20">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-lg sm:text-xl shrink-0">B</div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 leading-tight">BNSR Examination</h1>
          </div>
        </div>
        <div className="bg-red-50 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 text-xs sm:text-sm text-red-600 font-semibold border border-red-100 self-start sm:self-auto">
          <span className="hidden sm:inline">Verified Identity:</span>
          <span className="sm:hidden">Verified:</span>
          <strong>{bnsrCode}</strong>
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500 shrink-0"></div>
        </div>
      </header>
      <ExamFormView />
    </div>
  );
}

function LoginView() {
  const { bnsrCode, setBnsrCode, authenticate } = useExamStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!bnsrCode.trim()) {
      setError('กรุณากรอกรหัส BNSR');
      return;
    }

    setIsLoading(true);
    try {
      await submitToGoogleSheets('check_bnsr', { code: bnsrCode });
      authenticate();
    } catch (err: any) {
      setError(err.message || 'รหัสไม่ถูกต้อง หรือไม่พบในระบบ');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-slate-100">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 max-w-md w-full"
      >
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-600 rounded-xl flex items-center justify-center text-white font-bold text-xl sm:text-2xl mx-auto mb-3 sm:mb-4">B</div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">BNSR Examination System</h1>
          <p className="text-slate-500 text-xs sm:text-sm">กรุณากรอกรหัส BNSR ของคุณเพื่อเริ่มทำข้อสอบ</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="bnsr" className="block text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">
              รหัสยืนยันตัวตน (BNSR Code)
            </label>
            <input
              id="bnsr"
              type="text"
              value={bnsrCode}
              onChange={(e) => setBnsrCode(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-mono text-base focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors outline-none"
              placeholder="เช่น BNSR-1234"
              disabled={isLoading}
            />
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg text-sm font-medium"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                เข้าสู่ระบบ
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function ExamFormView() {
  const { bnsrCode, answers, setAnswer, isSubmitting, setIsSubmitting, setSuccess } = useExamStore();
  const [error, setError] = useState('');
  const [otherText, setOtherText] = useState('');

  const totalQuestions = mcqQuestions.length + essayQuestions.length;
  const answeredCount = Object.keys(answers).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (answeredCount < totalQuestions) {
      setError('กรุณาตอบคำถามให้ครบทุกข้อ');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    try {
      await submitToGoogleSheets('submit_exam', { 
        code: bnsrCode, 
        answers 
      });
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการส่งคำตอบ');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtherChange = (qId: string, text: string) => {
    setOtherText(text);
    setAnswer(qId, `3.4 อื่นๆ : ${text}`);
  };

  return (
    <main className="grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr] flex-1 gap-4 sm:gap-6 p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full items-start">
      <aside className="flex flex-col gap-4 static lg:sticky lg:top-[88px]">
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm">
          <div className="text-[0.65rem] sm:text-xs uppercase tracking-wider text-slate-500 mb-2 sm:mb-3 font-bold">รหัสยืนยันตัวตน</div>
          <div className="flex flex-col gap-2">
            <input type="text" className="w-full p-2.5 sm:p-3 border border-slate-200 rounded-lg bg-slate-50 font-mono text-sm sm:text-base text-slate-900 outline-none" value={bnsrCode} readOnly />
            <span className="text-[0.65rem] sm:text-[0.7rem] text-emerald-500 font-semibold">✓ รหัสถูกต้อง (Verified)</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm">
          <div className="text-[0.65rem] sm:text-xs uppercase tracking-wider text-slate-500 mb-2 sm:mb-3 font-bold">ความคืบหน้า ({answeredCount}/{totalQuestions})</div>
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {Array.from({ length: totalQuestions }).map((_, i) => {
              const qId = i < 5 ? mcqQuestions[i].id : essayQuestions[i - 5].id;
              const isAnswered = !!answers[qId];
              return (
                <div key={i} className={`w-full aspect-square rounded-md border flex items-center justify-center text-xs font-semibold transition-colors ${isAnswered ? 'bg-emerald-500 text-white border-emerald-500' : 'border-slate-200 text-slate-500'}`}>
                  {i + 1}
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl p-4 sm:p-5 shadow-sm bg-gradient-to-br from-slate-800 to-slate-700 text-white mt-1 sm:mt-2">
          <div className="text-sm sm:text-base font-semibold leading-relaxed text-center">
            <span className="text-amber-400 text-lg sm:text-xl block mb-1 sm:mb-2">🌟</span>
            ทำด้วยความซื่อสัตย์ <br />
            คำตอบที่ดีที่สุดคือคำตอบที่มาจากใจจริง
          </div>
        </div>
      </aside>

      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 lg:p-8 flex flex-col gap-5 sm:gap-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl text-sm font-medium border border-red-100">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Part 1: MCQ */}
          <div>
            <div className="text-base sm:text-lg font-extrabold text-red-600 pb-2 border-b-2 border-red-50 mb-4 sm:mb-6">ส่วนที่ 1 : ข้อสอบปรนัย</div>
            <div className="space-y-5 sm:space-y-6">
              {mcqQuestions.map((q) => (
                <div key={q.id} className="flex flex-col gap-2 sm:gap-3">
                  <p className="font-semibold text-[0.95rem] sm:text-[1.05rem] leading-relaxed text-slate-900">{q.text}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {q.options.map((opt, idx) => {
                      const isOther = q.hasOther && idx === q.options.length - 1;
                      const isSelected = isOther 
                        ? answers[q.id]?.startsWith('3.4 อื่นๆ') || false
                        : answers[q.id] === opt;

                      return (
                        <label key={idx} className={`p-3.5 border rounded-xl text-[0.95rem] cursor-pointer text-left transition-colors flex items-center gap-3 ${isSelected ? 'bg-red-50 border-red-600' : 'bg-slate-50 border-slate-200 hover:bg-red-50 hover:border-red-600'}`}>
                          <div className="relative flex items-center justify-center shrink-0">
                            <input
                              type="radio"
                              name={q.id}
                              value={opt}
                              checked={isSelected}
                              onChange={() => {
                                if (isOther) {
                                  setAnswer(q.id, `3.4 อื่นๆ : ${otherText}`);
                                } else {
                                  setAnswer(q.id, opt);
                                }
                              }}
                              className="peer sr-only"
                            />
                            <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-red-600' : 'border-slate-300'}`}>
                              {isSelected && <div className="w-2 h-2 rounded-full bg-red-600"></div>}
                            </div>
                          </div>
                          <span className="text-slate-700 font-medium">{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                  {q.hasOther && answers[q.id]?.startsWith('3.4 อื่นๆ') && (
                    <motion.input
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      type="text"
                      value={otherText}
                      onChange={(e) => handleOtherChange(q.id, e.target.value)}
                      placeholder="โปรดระบุ..."
                      className="mt-2 w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm bg-slate-50"
                      required
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Part 2: Essay */}
          <div>
            <div className="text-base sm:text-lg font-extrabold text-red-600 pb-2 border-b-2 border-red-50 mb-4 sm:mb-6 mt-6 sm:mt-8">ส่วนที่ 2 : ข้อสอบอัตนัย</div>
            <div className="space-y-5 sm:space-y-6">
              {essayQuestions.map((q) => (
                <div key={q.id} className="flex flex-col gap-2 sm:gap-3">
                  <label htmlFor={q.id} className="font-semibold text-[0.95rem] sm:text-[1.05rem] leading-relaxed text-slate-900">
                    {q.text}
                  </label>
                  <textarea
                    id={q.id}
                    rows={3}
                    value={answers[q.id] || ''}
                    onChange={(e) => setAnswer(q.id, e.target.value)}
                    className="w-full min-h-[80px] px-3 sm:px-4 py-3 sm:py-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors outline-none resize-y bg-slate-50 text-[0.9rem] sm:text-[0.95rem]"
                    placeholder="พิมพ์คำตอบของคุณที่นี่..."
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-200 flex justify-end gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  กำลังส่งคำตอบ...
                </>
              ) : (
                'ส่งข้อสอบ'
              )}
            </button>
          </div>
        </form>
      </section>

      <footer className="col-span-1 lg:col-span-2 mt-8 mb-4 text-center">
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-3xl mx-auto px-4">
          <strong>Bunny Save ขอสงวนลิขสิทธิ์</strong>ในชุดข้อสอบ เกณฑ์การตรวจสอบ และกระบวนการประเมินผู้ขายทั้งหมดอันเป็นทรัพย์สินทางปัญญาของแพลตฟอร์ม ห้ามมิให้บุคคลใดนำสิ่งดังกล่าวไปเผยแพร่ ดัดแปลง ทำซ้ำ หรือใช้ประโยชน์โดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษรจากแพลตฟอร์มก่อน
        </p>
      </footer>
    </main>
  );
}

function SuccessView() {
  const { reset } = useExamStore();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-slate-100">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-6 sm:p-8 lg:p-12 rounded-2xl shadow-sm border border-slate-200 max-w-lg w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"
        >
          <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-500" />
        </motion.div>
        
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">ส่งคำตอบสำเร็จ!</h1>
        <p className="text-slate-600 mb-6 sm:mb-8 text-base sm:text-lg">
          ระบบได้บันทึกคำตอบของคุณเรียบร้อยแล้ว ขอบคุณที่ให้ความร่วมมือและตอบคำถามด้วยความซื่อสัตย์
        </p>
        
        <button
          onClick={reset}
          className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3 px-6 rounded-xl transition-colors"
        >
          กลับสู่หน้าแรก
        </button>
      </motion.div>
    </div>
  );
}
