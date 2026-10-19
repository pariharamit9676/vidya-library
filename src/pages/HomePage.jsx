import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';
import { useCategories } from '../services/useLibraryQueries';
import { calculateMultiMonthFee, DEFAULT_DISCOUNTS } from '../utils/discountUtils';
import waterDropletAudio from '../assets/water-droplet-2.mp3';
import vidyaLogo from '../assets/vidya-library-logo.png';
import {
  BookOpenIcon,
  LogInIcon,
  UsersIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  CheckCircleIcon
} from '../components/Icons';
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Wifi,
  ShieldCheck,
  VolumeX,
  Clock,
  MapPin,
  Phone,
  ArrowRight,
  ChevronDown,
  Star,
  Zap,
  Coffee,
  Award,
  Calendar,
  X,
  Crown,
  Lock,
  Armchair,
  Play,
  Pause,
  Volume2,
  Gift,
  Tag
} from 'lucide-react';
import { studentService } from '../services/api';
import { referralService, findStudentByReferralCode } from '../services/referralService';

export const HomePage = () => {
  const { settings, showToast, students, createStudent } = useLibrary();
  const { data: serverCategories } = useCategories();

  // Ambient "Pin Drop Silence" Audio Player: water-droplet-2.mp3 repeating every 2 seconds until paused
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audioIntervalRef = React.useRef(null);
  const audioInstanceRef = React.useRef(null);

  const stopAmbience = React.useCallback(() => {
    // 1. Clear recurring 2-second interval
    if (audioIntervalRef.current) {
      clearInterval(audioIntervalRef.current);
      audioIntervalRef.current = null;
    }
    // 2. Pause audio and reset position
    if (audioInstanceRef.current) {
      try {
        audioInstanceRef.current.pause();
        audioInstanceRef.current.currentTime = 0;
      } catch (e) {}
    }
    setIsPlayingAudio(false);
  }, []);

  const playDroplet = React.useCallback(() => {
    try {
      if (!audioInstanceRef.current) {
        audioInstanceRef.current = new Audio(waterDropletAudio || '/water-droplet-2.mp3');
      }
      const audio = audioInstanceRef.current;
      audio.currentTime = 0;
      audio.volume = 0.9;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn('Audio play prevented or interrupted:', err);
        });
      }
    } catch (err) {
      console.error('Droplet play error', err);
    }
  }, []);

  const playAmbience = React.useCallback(() => {
    stopAmbience();

    // 1. Play immediately
    playDroplet();

    // 2. Repeat every 2 seconds continuously until paused
    audioIntervalRef.current = setInterval(() => {
      playDroplet();
    }, 2000);

    setIsPlayingAudio(true);
  }, [stopAmbience, playDroplet]);

  const toggleAmbience = () => {
    if (isPlayingAudio) {
      stopAmbience();
    } else {
      playAmbience();
    }
  };

  React.useEffect(() => {
    return () => {
      stopAmbience();
    };
  }, [stopAmbience]);

  // Multi-Month Discounts configured dynamically by Admin in Database / Settings
  const multiMonthDiscounts = useMemo(() => {
    return Array.isArray(settings?.multiMonthDiscounts) && settings.multiMonthDiscounts.length > 0
      ? settings.multiMonthDiscounts
      : DEFAULT_DISCOUNTS;
  }, [settings?.multiMonthDiscounts]);

  // Dynamic Contact Phone fetched from MongoDB Settings
  const contactPhone = useMemo(() => {
    const p1 = (settings?.phone || '').trim();
    const p2 = (settings?.adminPhone || '').trim();

    const candidates = [];
    if (p1) candidates.push(p1);
    if (p2 && p2 !== p1) candidates.push(p2);
    if (candidates.length === 0) candidates.push('9303961613');

    const flat = [];
    candidates.forEach((str) => {
      str.split(/[\/,]/).forEach((part) => {
        const item = part.trim();
        if (item && !flat.includes(item)) flat.push(item);
      });
    });

    const formattedList = flat.map((num) => {
      if (num.startsWith('+')) return num;
      const digits = num.replace(/[^0-9]/g, '');
      if (digits.length === 10) return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
      return `+91 ${num}`;
    });

    const display = formattedList.join(' / ');
    const primaryClean = (flat[0] || '9303961613').replace(/[^0-9]/g, '').slice(-10);
    return {
      display,
      tel: `tel:+91${primaryClean}`
    };
  }, [settings?.phone, settings?.adminPhone]);

  // Smooth scroll handler for anchor links
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const elem = document.querySelector(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Dynamic monthly seat rates configured by Admin in Database / Seat Management
  const dynamicRates = useMemo(() => {
    return {
      Premium: Number(serverCategories?.Premium?.rate) || 800,
      Reserve: Number(serverCategories?.Locker?.rate || serverCategories?.Reserve?.rate) || 650,
      Unreserve: Number(serverCategories?.Normal?.rate || serverCategories?.Unreserve?.rate) || 600
    };
  }, [serverCategories]);

  // 3 Seat Types: Premium (Cabin + Locker • 12 Seats), Reserve (Fixed Desk + Locker), Unreserve (Flexible Desk • No Locker)
  const seatCategories = useMemo(() => [
    {
      id: 'premium',
      categoryKey: 'Premium',
      name: 'Premium Seat',
      badge: '★ Luxury Cabin • 12 Seats',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      cabinSeats: 12,
      hasLocker: true,
      hasCabin: true,
      basePrice: dynamicRates.Premium,
      icon: '👑',
      tagline: 'Private Cabin + Personal Locker',
      description: 'Exclusive acoustic soundproof cabin with only 12 private desks for high-focus CA/UPSC aspirants.',
      highlights: [
        'Private 12-Seat Soundproof Acoustic Cabin',
        'Personal Secure Storage Locker Included',
        'Permanent Assigned Desk (24/7 Guaranteed)',
        'Ergonomic Leather/Mesh Reclining Chair',
        'Individual Warm Reading Lamp & Socket'
      ]
    },
    {
      id: 'reserve',
      categoryKey: 'Locker',
      name: 'Reserve Seat',
      badge: 'Fixed Desk + Locker',
      badgeColor: 'bg-teal-50 text-teal-800 border-teal-200',
      cabinSeats: null,
      hasLocker: true,
      hasCabin: false,
      basePrice: dynamicRates.Reserve,
      icon: '🔒',
      tagline: 'Fixed Reserved Desk + Locker',
      description: 'Permanent reserved desk in the main reading hall where you can leave your heavy books safely in your locker.',
      highlights: [
        'Personal Secure Storage Locker Included',
        'Permanent Fixed Desk (Leave Books Daily)',
        'Guaranteed Same Reserved Desk Everyday',
        'Ergonomic Lumbar Cushion Mesh Chair',
        'Dedicated Universal 3-Pin Socket & Lamp'
      ]
    },
    {
      id: 'unreserve',
      categoryKey: 'Normal',
      name: 'Unreserve Seat',
      badge: 'Flexible Study Desk',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
      cabinSeats: null,
      hasLocker: false,
      hasCabin: false,
      basePrice: dynamicRates.Unreserve,
      icon: '🪑',
      tagline: 'Flexible Study Desk (No Locker)',
      description: 'Standard comfortable desk in the silent air-conditioned hall with power socket and 300 Mbps Wi-Fi (No locker).',
      highlights: [
        'Flexible Study Desk in Pin-Drop Silent Hall',
        'No Locker Included (Locker-Free Plan)',
        'Dual 300 Mbps Ultra-Fast 5G Wi-Fi',
        'Alkaline Purified RO Chilled & Hot Water',
        'Daily The Hindu & Hindi Newspapers'
      ]
    }
  ], [dynamicRates]);

  const [selectedSeatId, setSelectedSeatId] = useState('premium');
  const activeSeat = seatCategories.find((c) => c.id === selectedSeatId) || seatCategories[0];

  // The 4 Pricing Plans: Monthly (1m), Quarterly (Quater • 3m), Half-Yearly (Half • 6m), Yearly (Annual • 12m)
  const planTiers = [
    {
      id: 'monthly',
      name: 'Monthly Plan',
      subName: '1m',
      durationLabel: '1 Month (1m)',
      months: 1,
      popular: false
    },
    {
      id: 'quarterly',
      name: 'Quarterly Plan',
      subName: 'Quater (3m)',
      durationLabel: '3 Months (3m)',
      months: 3,
      popular: false
    },
    {
      id: 'half_yearly',
      name: 'Half-Yearly Plan',
      subName: 'Half (6m)',
      durationLabel: '6 Months (6m)',
      months: 6,
      popular: false
    },
    {
      id: 'yearly',
      name: 'Yearly Plan',
      subName: 'Annual (12m)',
      durationLabel: '12 Months (1y)',
      months: 12,
      popular: true
    }
  ];

  // Interactive States
  const [openFaq, setOpenFaq] = useState(0);
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
  const [trialForm, setTrialForm] = useState({
    name: '',
    phone: '',
    referralCode: ''
  });
  const [trialSubmitted, setTrialSubmitted] = useState(false);
  const [isSubmittingTrial, setIsSubmittingTrial] = useState(false);
  const [registeredDemoInfo, setRegisteredDemoInfo] = useState(null);

  // Live lookup of entered referral code
  const verifiedReferrer = useMemo(() => {
    if (!trialForm.referralCode || trialForm.referralCode.trim().length < 3) return null;
    return findStudentByReferralCode(trialForm.referralCode, students || []);
  }, [trialForm.referralCode, students]);

  const handleTrialSubmit = async (e) => {
    e.preventDefault();
    const cleanPhone = trialForm.phone.replace(/\D/g, '');
    if (!trialForm.name.trim()) {
      if (showToast) showToast('Please enter your Name', 'error');
      return;
    }
    if (cleanPhone.length < 10) {
      if (showToast) showToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }

    if (verifiedReferrer && String(verifiedReferrer.phone).replace(/\D/g, '') === cleanPhone) {
      if (showToast) showToast('You cannot use your own referral code!', 'error');
      return;
    }

    try {
      setIsSubmittingTrial(true);

      const studentPayload = {
        name: trialForm.name.trim(),
        phone: cleanPhone,
        studentType: 'Demo',
        status: 'Demo',
        plan: 'Daily',
        shift: 'Full Day',
        seatNo: '-',
        seatCategory: 'Normal',
        exam: 'General',
        dueAmount: 0,
        admissionDate: new Date().toISOString().slice(0, 10),
        referredBy: verifiedReferrer ? (verifiedReferrer.studentId || verifiedReferrer.id) : null,
        referrerName: verifiedReferrer ? verifiedReferrer.name : null,
        referralCodeUsed: trialForm.referralCode.trim().toUpperCase() || null,
        referralStatus: verifiedReferrer ? 'Pending' : null,
        notes: 'Free Trial Desk Registration from Website'
      };

      let createdStudent = null;
      try {
        const res = await studentService.create(studentPayload);
        if (res && res.data) {
          createdStudent = res.data;
        }
      } catch (err) {
        if (createStudent) {
          createdStudent = createStudent(studentPayload);
        }
      }

      const registeredId = createdStudent?.id || createdStudent?._id || `stu_demo_${Date.now()}`;

      if (verifiedReferrer) {
        referralService.createReferralLead({
          referrer: verifiedReferrer,
          referee: {
            id: registeredId,
            name: trialForm.name.trim(),
            phone: cleanPhone
          },
          notes: `Trial registered via Website. Shift: ${trialForm.shift}`
        });
      }

      setRegisteredDemoInfo({
        name: trialForm.name.trim(),
        phone: cleanPhone,
        referrerName: verifiedReferrer ? verifiedReferrer.name : null
      });

      setTrialSubmitted(true);
      if (showToast) {
        showToast('🎉 Free Trial Desk Reserved! Status set to Demo.', 'success');
      }
    } catch (err) {
      console.error('Error reserving trial desk:', err);
      if (showToast) showToast(err?.message || 'Failed to reserve trial desk', 'error');
    } finally {
      setIsSubmittingTrial(false);
    }
  };

  const closeTrialModal = () => {
    setIsTrialModalOpen(false);
    setTrialSubmitted(false);
    setRegisteredDemoInfo(null);
  };

  const reviews = [
    {
      name: 'Rohit Meena',
      exam: 'UPSC CSE Aspirant (AIR 142)',
      comment: 'The absolute pin-drop silence and ergonomic seating allowed me to put in 10-12 hours of unbroken focus every day. Without Vidya Library, this rank would not have been possible.',
      rating: 5,
      avatarBg: 'bg-emerald-600'
    },
    {
      name: 'Priya Sharma',
      exam: 'CA Finalist',
      comment: 'Having a permanent 24/7 desk meant I could leave heavy study modules safely. The fiber internet and warm private cubicle lamps are top tier.',
      rating: 5,
      avatarBg: 'bg-teal-600'
    },
    {
      name: 'Aman Verma',
      exam: 'SSC CGL Inspector Ranker',
      comment: 'Clean desk cubicles, zero noise policy, and cold RO water. By far the most disciplined and serious study environment in Gwalior.',
      rating: 5,
      avatarBg: 'bg-amber-600'
    }
  ];

  const faqs = [
    {
      q: 'What is the difference between Premium, Reserve, and Unreserve seats?',
      a: '• Premium Seat: Located inside a luxury soundproof acoustic cabin with only 12 exclusive desks and includes an assigned personal secure locker.\n• Reserve Seat: Dedicated fixed desk in the main reading hall where you can leave your books and notes, plus an assigned personal locker.\n• Unreserve Seat: Flexible daily study desk in the air-conditioned silent hall without locker.'
    },
    {
      q: 'Can I leave my books and notes at my desk?',
      a: 'Yes! Both Premium (Cabin + Locker) and Reserve (Fixed Desk + Locker) seats allow you to permanently leave your books, study modules, laptop, and notes safely at your desk and in your private personal locker.'
    },
    {
      q: 'How is the "Pin Drop Silence" environment maintained?',
      a: 'Our reading halls and private cabins are acoustically insulated with sound-dampening panels and soft-carpet flooring. All mobile phone ringers and conversations are strictly forbidden inside; a separate acoustic booth is provided outside for calls.'
    },
    {
      q: 'Can I test the library before paying admission fees?',
      a: 'Yes, absolutely. We offer a 100% Free 1-Day Trial Desk so you can experience the chair comfort, Wi-Fi speed, and silence atmosphere before making any commitment.'
    },
    {
      q: 'How do the Quarterly, Half-Yearly, and Yearly discounts work?',
      a: 'Discounts are configured directly by administration and automatically applied when booking multi-month plans: Quarterly (Quater / 3 months), Half-Yearly (Half / 6 months), and Yearly (Annual / 12 months), with zero security deposit.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFD] text-[#192038] selection:bg-[#544bec] selection:text-white font-sans">
      
      {/* ===================================================================== */}
      {/* 1. MODERN GLASS NAVBAR (100% FULL-WIDTH, FLUSH AT TOP) */}
      {/* ===================================================================== */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-xl border-b border-[#E2E8F0] shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-3">
          {/* Logo & Tagline */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group min-w-0">
            <img
              src={vidyaLogo}
              alt="Vidya Library Logo"
              className="h-8 sm:h-10 w-auto object-contain group-hover:scale-105 transition-transform shrink-0"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-sm sm:text-xl font-black tracking-tight text-[#192038] truncate">
                  Vidya Library
                </span>
                <span className="hidden xs:inline-flex items-center gap-1 text-[9px] uppercase font-black px-2 py-0.5 rounded-full bg-[#EEF0FD] text-[#544bec] border border-[#544bec]/20 shrink-0">
                  Pin Drop Silence
                </span>
              </div>
              <p className="text-[9px] sm:text-[11px] text-[#8F9BB3] -mt-0.5 m-0 font-medium truncate">
                Premier Air-Conditioned Reading Lounge
              </p>
            </div>
          </Link>

          {/* Clean Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-[#64748B]">
            <a href="#amenities" onClick={(e) => handleNavClick(e, '#amenities')} className="hover:text-[#544bec] transition-colors">Amenities</a>
            <a href="#plans" onClick={(e) => handleNavClick(e, '#plans')} className="hover:text-[#544bec] transition-colors font-extrabold text-[#544bec]">Plans & Pricing</a>
            <a href="#reviews" onClick={(e) => handleNavClick(e, '#reviews')} className="hover:text-[#544bec] transition-colors">Ranker Reviews</a>
            <a href="#faqs" onClick={(e) => handleNavClick(e, '#faqs')} className="hover:text-[#544bec] transition-colors">FAQs</a>
            <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} className="hover:text-[#544bec] transition-colors">Location</a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <a
              href={contactPhone.tel}
              className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold text-[#192038] hover:text-[#544bec] transition-colors"
              title="Call Front Desk Helpline"
            >
              <Phone size={13} className="text-[#544bec]" />
              <span>{contactPhone.display.split('/')[0].trim()}</span>
            </a>
            <Link
              to="/login?role=student"
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold border border-[#544bec]/30 bg-[#EEF0FD] text-[#544bec] hover:bg-[#d8f4ea] transition-all cursor-pointer whitespace-nowrap shadow-xs"
            >
              <GraduationCap size={13} />
              <span>Student</span>
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-black bg-[#544bec] hover:bg-[#4338ca] text-white shadow-sm shadow-[#544bec]/30 transition-all hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
            >
              <LogInIcon size={13} />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* 2. COMPACT & RESPONSIVE HERO SECTION */}
      {/* ===================================================================== */}
      <section className="relative pt-4 sm:pt-8 pb-8 sm:pb-14 px-4 sm:px-8 max-w-7xl mx-auto w-full overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#544bec]/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          {/* Left Column: Headlines & Actions */}
          <div className="lg:col-span-7 flex flex-col gap-3.5 sm:gap-5">
            
            {/* Tagline Status Chips */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EEF0FD] border border-[#544bec]/30 text-[#544bec] text-[11px] font-extrabold shadow-2xs">
                <Sparkles size={11} className="text-[#544bec]" />
                Pin Drop Silence
              </span>

              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-[#E2E8F0] text-[#64748B] text-[11px] font-bold shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#544bec]"></span>
                Open 24/7 • 365 Days
              </span>

              <a
                href="https://maps.google.com/?q=66W8%2B4FH,+Gayatri+Nagar,+Gwalior,+Madhya+Pradesh+474005"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF9F2] border border-[#FFE0B2] text-[#B45309] text-[11px] font-bold shadow-2xs hover:bg-[#FFF3E0] transition-colors"
              >
                <MapPin size={11} className="text-[#B45309]" />
                <span>Gayatri Nagar, Gwalior</span>
              </a>
            </div>

            {/* Editorial Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.14] text-[#192038]">
              Where Deep Focus Meets <br />
              <span className="bg-gradient-to-r from-[#544bec] via-teal-500 to-emerald-600 bg-clip-text text-transparent">
                Pin Drop Silence.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xs sm:text-base text-[#64748B] leading-relaxed max-w-lg">
              An advanced luxury reading lounge purpose-built for <strong className="text-[#192038]">UPSC, SSC, NEET, JEE & CA aspirants</strong>.
              Enjoy 100% soundproof calm, dual 300 Mbps 5G fiber, warm cubicle lights, and ergonomic cushion seating for 12+ hours daily.
            </p>

            {/* Metric Strip */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 p-2.5 sm:p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-xs max-w-md">
              <div className="text-center sm:text-left">
                <div className="text-lg sm:text-2xl font-black text-[#544bec]">40+</div>
                <div className="text-[10px] sm:text-xs text-[#64748B] font-semibold mt-0.5">Cubicles</div>
              </div>
              <div className="border-x border-[#E2E8F0] px-1 sm:px-3 text-center sm:text-left">
                <div className="text-lg sm:text-2xl font-black text-amber-500 whitespace-nowrap">300 Mbps</div>
                <div className="text-[10px] sm:text-xs text-[#64748B] font-semibold mt-0.5">5G Fiber</div>
              </div>
              <div className="pl-0.5 sm:pl-2 text-center sm:text-left">
                <div className="text-lg sm:text-2xl font-black text-[#192038] flex items-center justify-center sm:justify-start gap-1">
                  4.9 <Star size={14} className="fill-amber-400 text-amber-400 inline" />
                </div>
                <div className="text-[10px] sm:text-xs text-[#64748B] font-semibold mt-0.5">250+ Rankers</div>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-0.5">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsTrialModalOpen(true)}
                className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#544bec] to-teal-500 hover:from-[#4338ca] hover:to-teal-600 text-white font-black text-xs sm:text-sm shadow-md shadow-[#544bec]/25 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <Sparkles size={15} />
                <span>Claim 1-Day Free Trial Desk</span>
                <ArrowRight size={14} />
              </motion.button>

              <a
                href="#plans"
                onClick={(e) => handleNavClick(e, '#plans')}
                className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#544bec]/40 text-[#192038] font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition-all shadow-2xs hover:bg-slate-50"
              >
                <Clock size={15} className="text-[#544bec]" />
                <span>Explore 4 Plans & Pricing</span>
              </a>
            </div>

            {/* Quick Guarantees */}
            <div className="flex items-center gap-2.5 sm:gap-4 text-[11px] sm:text-xs text-[#64748B] pt-0.5 flex-wrap">
              <span className="flex items-center gap-1 text-[#544bec] font-bold">
                <CheckCircle2 size={13} /> Zero Deposit
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[#544bec] font-bold">
                <CheckCircle2 size={13} /> 100% Free Demo Seat
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[#544bec] font-bold">
                <CheckCircle2 size={13} /> 24/7 Monitored Calm
              </span>
            </div>
          </div>

          {/* Right Column: Multi-Layer Luxury Photo & Clean Status Frame */}
          <div className="lg:col-span-5 relative mt-2 lg:mt-0">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#CBD5E1] shadow-xl bg-white group">
              <img
                src="/vidya_library_hero.jpg"
                alt="Vidya Library Luxury Reading Lounge"
                className="w-full h-[220px] sm:h-[300px] lg:h-[350px] object-cover group-hover:scale-102 transition-transform duration-500"
              />
              {/* Subtle Atmospheric Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

              {/* Floating Top Chip */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                <div className="px-2.5 py-1 rounded-lg backdrop-blur-md bg-white/95 text-[#192038] text-[11px] font-black shadow-md border border-white/40 flex items-center gap-1">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  <span>Ranker's Choice Study Hub</span>
                </div>
                <div className="px-2.5 py-1 rounded-lg backdrop-blur-md bg-slate-900/90 text-emerald-400 text-[11px] font-extrabold border border-emerald-500/30">
                  Pin Drop Silence
                </div>
              </div>

              {/* Floating Bottom Info Panel with Interactive "Pin Drop Silence" Audio Player */}
              <div className="absolute bottom-3 left-3 right-3 p-2.5 sm:p-3 rounded-xl backdrop-blur-xl bg-white/95 border border-white/50 shadow-lg flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    type="button"
                    onClick={toggleAmbience}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                      isPlayingAudio
                        ? 'bg-[#544bec] text-white shadow-md shadow-[#544bec]/40 scale-105'
                        : 'bg-[#EEF0FD] text-[#544bec] hover:bg-[#544bec] hover:text-white'
                    }`}
                    title={isPlayingAudio ? "Pause Pin Drop Silence" : "Play Pin Drop Silence"}
                    aria-label={isPlayingAudio ? "Pause Pin Drop Silence" : "Play Pin Drop Silence"}
                  >
                    {isPlayingAudio ? (
                      <Pause size={17} className="animate-pulse" />
                    ) : (
                      <Play size={17} className="ml-0.5 fill-current" />
                    )}
                  </button>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-black text-[#192038] truncate flex items-center gap-1.5">
                      <span>Pin Drop Silence</span>
                      {isPlayingAudio && (
                        <span className="flex items-end gap-0.5 h-3 text-[#544bec]">
                          <span className="w-1 h-2 bg-[#544bec] rounded-full animate-bounce" style={{ animationDuration: '0.6s', animationDelay: '0ms' }}></span>
                          <span className="w-1 h-3.5 bg-[#544bec] rounded-full animate-bounce" style={{ animationDuration: '0.6s', animationDelay: '150ms' }}></span>
                          <span className="w-1 h-2 bg-[#544bec] rounded-full animate-bounce" style={{ animationDuration: '0.6s', animationDelay: '300ms' }}></span>
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-bold truncate transition-colors text-[#544bec]">
                      {isPlayingAudio ? "Playing silence..." : "Tap to listen"}
                    </div>
                  </div>
                </div>

                {/* Right Action: Play / Stop Button */}
                <button
                  type="button"
                  onClick={toggleAmbience}
                  className={`text-[10px] sm:text-[11px] font-black uppercase px-2.5 sm:px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                    isPlayingAudio
                      ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 shadow-xs'
                      : 'bg-[#544bec] text-white hover:bg-[#009268] shadow-xs hover:shadow-md'
                  }`}
                >
                  {isPlayingAudio ? (
                    <>
                      <VolumeX size={13} />
                      <span>Stop</span>
                    </>
                  ) : (
                    <>
                      <Volume2 size={13} />
                      <span>Play</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. WORLD-CLASS AMENITIES (BENTO GRID DESIGN) */}
      {/* ===================================================================== */}
      <section id="amenities" className="py-8 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#544bec] bg-[#EEF0FD] px-3 py-1 rounded-full border border-[#544bec]/20">
            WORLD-CLASS AMENITIES
          </span>
          <h2 className="text-2xl sm:text-4xl font-black mt-2 text-[#192038] tracking-tight">
            Engineered for 12+ Hours Daily Focus
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1.5 leading-relaxed">
            Every feature at Vidya Library is created to eliminate distractions, protect your posture, and maintain your flow state.
          </p>
        </div>

        {/* Clean 6-Card Harmonious Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          
          {/* Feature 1: Pin Drop Silence */}
          <motion.div
            whileHover={{ y: -3, transition: { duration: 0.18 } }}
            className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-[#544bec]/40 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#EEF0FD] text-[#544bec] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <VolumeX size={18} />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#192038] mb-1">
                Pin Drop Silence Sanctuary
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Acoustically soundproof halls with noise-absorbing carpets, soft desk padding, and a strict zero-ringer mobile discipline.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#F1F5F9] text-[11px] font-bold text-[#544bec] flex items-center gap-1">
              <CheckCircle2 size={13} /> Ambient Quiet ~18 dB
            </div>
          </motion.div>

          {/* Feature 2: Dual 300 Mbps Fiber */}
          <motion.div
            whileHover={{ y: -3, transition: { duration: 0.18 } }}
            className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-[#544bec]/40 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Wifi size={18} />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#192038] mb-1">
                Dual 300 Mbps 5G Fiber
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Zero-lag optical connections. Stream 4K video lectures, mock test portals, and cloud revision materials without buffering.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#F1F5F9] text-[11px] font-bold text-teal-600 flex items-center gap-1">
              <Zap size={13} /> Uncapped High Speed
            </div>
          </motion.div>

          {/* Feature 3: Ergonomic Desks */}
          <motion.div
            whileHover={{ y: -3, transition: { duration: 0.18 } }}
            className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-[#544bec]/40 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Armchair size={18} />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#192038] mb-1">
                Ergonomic 12-Hr Chairs
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                High-back breathable mesh chairs with dynamic lumbar support and elbow pads to eliminate study fatigue and neck pain.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#F1F5F9] text-[11px] font-bold text-indigo-600 flex items-center gap-1">
              <CheckCircle2 size={13} /> Posture-Friendly
            </div>
          </motion.div>

          {/* Feature 4: Personal Warm LED Lamp */}
          <motion.div
            whileHover={{ y: -3, transition: { duration: 0.18 } }}
            className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-[#544bec]/40 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Zap size={18} />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#192038] mb-1">
                Personal Warm LED Lamp
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Dedicated 3-pin universal socket and eye-friendly flicker-free warm LED reading lamp at each private cubicle.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#F1F5F9] text-[11px] font-bold text-amber-600 flex items-center gap-1">
              <CheckCircle2 size={13} /> 100% Private Power
            </div>
          </motion.div>

          {/* Feature 5: Dual Power Backup */}
          <motion.div
            whileHover={{ y: -3, transition: { duration: 0.18 } }}
            className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-[#544bec]/40 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <ShieldCheck size={18} />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#192038] mb-1">
                Dual Silent Power Backup
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Dual commercial silent inverters and generator backup to ensure power cuts never interrupt your exam preparation.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#F1F5F9] text-[11px] font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 size={13} /> Zero Downtime
            </div>
          </motion.div>

          {/* Feature 6: RO Water & 24/7 Security */}
          <motion.div
            whileHover={{ y: -3, transition: { duration: 0.18 } }}
            className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:border-[#544bec]/40 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Coffee size={18} />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#192038] mb-1">
                Alkaline RO & 24/7 Security
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Multi-stage purified chilled & hot water dispenser with full HD CCTV surveillance for a completely secure study space.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-[#F1F5F9] text-[11px] font-bold text-sky-600 flex items-center gap-1">
              <Lock size={13} /> Safe & Clean Space
            </div>
          </motion.div>

        </div>
      </section>

      {/* ===================================================================== */}
      {/* 5. THE 4 DURATION PLANS (MONTHLY, QUATER, HALF, YEARLY) & SEAT PRICING */}
      {/* ===================================================================== */}
      {/* ===================================================================== */}
      {/* 5. 3 SEAT CATEGORIES & 4 DURATION PLANS (CALCULATED VIA ADMIN DISCOUNTS) */}
      {/* ===================================================================== */}
      <section id="plans" className="py-10 sm:py-16 px-4 sm:px-8 bg-gradient-to-b from-white via-[#F8FAFD] to-white border-y border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto w-full">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#544bec] bg-[#EEF0FD] px-3 py-1 rounded-full border border-[#544bec]/20">
              3 Seat Types • 4 Plans
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-2 text-[#192038] tracking-tight">
              Seat Rates & Advance Discounts
            </h2>
            <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
              Choose your seat type to check advance multi-month discounted pricing.
            </p>
          </div>

          {/* Step 1: Compact 3 Radio Buttons with Animated Sliding Indicator */}
          <div className="max-w-3xl mx-auto mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-1.5 p-1.5 bg-slate-100/90 border border-slate-200/90 rounded-2xl relative">
              {seatCategories.map((seat) => {
                const isSelected = selectedSeatId === seat.id;
                return (
                  <label
                    key={seat.id}
                    onClick={() => setSelectedSeatId(seat.id)}
                    className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl cursor-pointer transition-colors w-full sm:w-auto flex-1 select-none"
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="seatRadioActivePill"
                        className="absolute inset-0 bg-white rounded-xl shadow-xs border border-slate-300/80 -z-0"
                        transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                      />
                    )}
                    <input
                      type="radio"
                      name="seatTypeRadio"
                      checked={isSelected}
                      onChange={() => setSelectedSeatId(seat.id)}
                      className="w-4 h-4 accent-[#544bec] cursor-pointer shrink-0 relative z-10"
                    />
                    <span className="text-sm shrink-0 relative z-10">{seat.icon}</span>
                    <span className={`text-xs font-bold relative z-10 truncate ${isSelected ? 'text-[#192038]' : 'text-slate-600'}`}>
                      {seat.name}
                    </span>
                    <span className="text-xs font-black text-[#544bec] ml-auto shrink-0 relative z-10">
                      ₹{seat.basePrice}<span className="text-[10px] font-normal text-slate-400">/mo</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Step 2: The 4 Plan Cards with Smooth Animated Transition */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedSeatId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch"
            >
              {planTiers.map((tier, idx) => {
                const calc = calculateMultiMonthFee(tier.months, activeSeat.basePrice, multiMonthDiscounts);
                const discountedMonthlyRate = Math.round(calc.finalTotal / tier.months);
                const totalAmount = calc.finalTotal;
                const savings = calc.discountAmount;

                return (
                  <motion.div
                    key={tier.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.04 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className={`rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative transition-shadow duration-200 ${
                      tier.popular
                        ? 'bg-white border-2 border-[#544bec] shadow-lg shadow-[#544bec]/10 ring-2 ring-[#544bec]/20'
                        : 'bg-white border border-[#E2E8F0] shadow-2xs hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div>
                      {/* Top Duration & Discount Badge */}
                      <div className="flex items-center justify-between gap-1.5 mb-2.5 min-h-[22px]">
                        {calc.hasDiscount ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-300">
                            {calc.discountItem?.discountType === 'percentage'
                              ? `${calc.discountItem.discountValue}% OFF`
                              : `₹${calc.discountItem?.discountValue} OFF`}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200">
                            Standard
                          </span>
                        )}
                        <span className="text-[11px] font-bold text-slate-500">
                          {tier.durationLabel}
                        </span>
                      </div>

                      {/* Plan Name */}
                      <h3 className="text-base sm:text-lg font-black text-[#192038] mb-0.5">
                        {tier.name}
                      </h3>
                      <div className="text-[11px] font-medium text-slate-500 mb-2 truncate">
                        {activeSeat.name} ({activeSeat.tagline})
                      </div>

                      {/* Dynamic Price Display */}
                      <div className="py-2.5 my-1.5 border-y border-[#F1F5F9]">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl sm:text-3xl font-black tracking-tight text-[#192038]">
                            ₹{discountedMonthlyRate}
                          </span>
                          <span className="text-[11px] font-semibold text-[#64748B]">
                            /mo
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px] mt-1">
                          <span className="text-[#64748B] font-semibold">
                            Total: <strong className="text-[#192038]">₹{totalAmount}</strong>
                          </span>
                          {savings > 0 ? (
                            <span className="font-extrabold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 text-[10px]">
                              Save ₹{savings}
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[10px]">Regular</span>
                          )}
                        </div>
                      </div>

                      {/* Seat Features List for this Card */}
                      <div className="flex flex-col gap-1.5 pt-2 text-[11px] text-[#192038]">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 size={13} className="text-[#544bec] shrink-0" />
                          <span className="font-semibold truncate">
                            {activeSeat.id === 'premium' && 'Private 12-Seat Acoustic Cabin'}
                            {activeSeat.id === 'reserve' && 'Permanent Fixed Reserved Desk'}
                            {activeSeat.id === 'unreserve' && 'Flexible Silent Hall Desk'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 size={13} className={activeSeat.hasLocker ? 'text-[#544bec] shrink-0' : 'text-slate-400 shrink-0'} />
                          <span className={activeSeat.hasLocker ? 'font-semibold truncate' : 'text-slate-400 truncate'}>
                            {activeSeat.hasLocker ? 'Personal Locker Included' : 'No Locker'}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 size={13} className="text-[#544bec] shrink-0" />
                          <span className="font-medium text-slate-600 truncate">
                            Dual 300 Mbps 5G Fiber & Power Backup
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action CTA */}
                    <div className="pt-4 mt-2">
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          setTrialForm((prev) => ({
                            ...prev,
                            seatCategory: `${activeSeat.name} (${activeSeat.tagline})`,
                            plan: `${tier.name} (${tier.durationLabel})`
                          }));
                          setIsTrialModalOpen(true);
                        }}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer text-center ${
                          tier.popular
                            ? 'bg-[#544bec] text-white hover:bg-[#4338ca] shadow-sm shadow-[#544bec]/25'
                            : 'bg-slate-100 text-slate-800 hover:bg-[#544bec] hover:text-white'
                        }`}
                      >
                        Choose {tier.name} →
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* Quick Notice */}
          <div className="text-center mt-6 text-xs text-[#64748B]">
            💡 <strong className="text-[#192038]">Admin Transparency:</strong> Seat fees and multi-month advance discounts are configured directly in library settings with <strong className="text-[#192038]">Zero Security Deposit</strong>.
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 6. ASPIRANT REVIEWS & WALL OF SUCCESS */}
      {/* ===================================================================== */}
      <section id="reviews" className="py-14 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full border-t border-[#E2E8F0]">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-[#544bec] bg-[#EEF0FD] px-3.5 py-1.5 rounded-full border border-[#544bec]/20">
            TESTIMONIALS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black mt-3 text-[#192038] tracking-tight">
            Trusted by Top Exam Rankers
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-2">
            Real feedback from aspirants who cracked their dreams studying at Vidya Library.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-5"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(r.rating)].map((_, idx) => (
                    <Star key={idx} size={15} className="fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#334155] italic leading-relaxed m-0">
                  "{r.comment}"
                </p>
              </div>

              <div className="border-t border-[#F1F5F9] pt-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${r.avatarBg} text-white font-black text-sm flex items-center justify-center shrink-0`}>
                  {r.name.charAt(0)}
                </div>
                <div>
                  <strong className="text-sm block text-[#192038] font-black">{r.name}</strong>
                  <span className="text-[11px] text-[#544bec] font-bold">{r.exam}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 7. FREQUENTLY ASKED QUESTIONS (ACCORDION) */}
      {/* ===================================================================== */}
      <section id="faqs" className="py-14 sm:py-20 px-4 sm:px-8 max-w-4xl mx-auto w-full border-t border-[#E2E8F0]">
        <div className="text-center mb-10 sm:mb-14">
          <span className="text-xs font-black uppercase tracking-widest text-[#544bec] bg-[#EEF0FD] px-3.5 py-1.5 rounded-full border border-[#544bec]/20">
            GOT QUESTIONS?
          </span>
          <h2 className="text-3xl sm:text-4xl font-black mt-3 text-[#192038] tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white border border-[#E2E8F0] overflow-hidden transition-all shadow-xs"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                className="w-full p-4 sm:p-5 text-left font-bold text-sm text-[#192038] flex items-center justify-between gap-4 cursor-pointer hover:bg-[#F8FAFD]"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-[#64748B] transition-transform duration-200 shrink-0 ${
                    openFaq === idx ? 'rotate-180 text-[#544bec]' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1 text-xs text-[#64748B] leading-relaxed border-t border-[#F1F5F9]">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 8. INTERACTIVE TRIAL / DESK RESERVATION MODAL */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {isTrialModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#CBD5E1] relative"
            >
            <button
              onClick={closeTrialModal}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F1F5F9] text-[#64748B] hover:text-[#192038] flex items-center justify-center cursor-pointer transition-colors"
            >
              <X size={18} />
            </button>

            {!trialSubmitted ? (
              <form onSubmit={handleTrialSubmit} className="flex flex-col gap-3.5">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EEF0FD] text-[#544bec] text-[11px] font-black uppercase mb-1">
                    <Sparkles size={12} /> 100% Free Trial Desk
                  </div>
                  <h3 className="text-xl font-black text-[#192038] m-0">
                    Reserve Your Desk at Vidya Library
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1 m-0">
                    Register for your free trial desk. Your status will be <strong>Demo</strong> until you visit the library, pay your fee, and select your seat.
                  </p>
                </div>

                <div className="space-y-3 pt-1">
                  <div>
                    <label className="text-xs font-bold text-[#192038] block mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={trialForm.name}
                      onChange={(e) => setTrialForm({ ...trialForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs outline-none focus:border-[#544bec] focus:ring-2 focus:ring-[#544bec]/20 text-[#192038]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#192038] block mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="e.g. 9876543210"
                      value={trialForm.phone}
                      onChange={(e) => setTrialForm({ ...trialForm, phone: e.target.value.replace(/\D/g, '') })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-xs outline-none focus:border-[#544bec] focus:ring-2 focus:ring-[#544bec]/20 text-[#192038]"
                    />
                  </div>

                  {/* Referral Code Field with Real-time Verification */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-[#192038] flex items-center gap-1.5">
                        <Gift size={13} className="text-[#544bec]" />
                        <span>Referral Code (Optional)</span>
                      </label>
                      <span className="text-[10px] text-[#8F9BB3] font-medium">Friend's code</span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. AMIT2333"
                        value={trialForm.referralCode}
                        onChange={(e) => setTrialForm({ ...trialForm, referralCode: e.target.value.toUpperCase() })}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs outline-none uppercase font-mono tracking-wider transition-all ${
                          verifiedReferrer
                            ? 'border-emerald-500 bg-emerald-50/30 text-emerald-900 focus:ring-2 focus:ring-emerald-500/20'
                            : 'border-[#CBD5E1] text-[#192038] focus:border-[#544bec] focus:ring-2 focus:ring-[#544bec]/20'
                        }`}
                      />
                      {verifiedReferrer && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600">
                          <CheckCircle2 size={16} />
                        </div>
                      )}
                    </div>

                    {/* Dynamic Feedback on Referral Code */}
                    {verifiedReferrer ? (
                      <div className="mt-1.5 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 font-bold flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
                        <span>
                          Referral Applied! Referred by <strong>{verifiedReferrer.name}</strong> • ₹100 Benefit on Admission
                        </span>
                      </div>
                    ) : trialForm.referralCode.trim().length >= 4 ? (
                      <p className="mt-1 text-[11px] text-amber-600 font-medium m-0">
                        Code not recognized, but you can still reserve your free trial desk.
                      </p>
                    ) : null}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingTrial}
                  className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-md shadow-slate-900/20 transition-all cursor-pointer mt-1 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmittingTrial ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Registering Demo Account...</span>
                    </>
                  ) : (
                    <span>Confirm Free Demo Registration →</span>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-4 flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#544bec] border border-emerald-200 flex items-center justify-center">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-black text-[#192038] m-0">
                  Free Trial Reserved!
                </h3>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                  Status: Demo Student (Trial Active)
                </div>

                <p className="text-xs text-[#64748B] max-w-sm leading-relaxed m-0">
                  Hi <strong>{registeredDemoInfo?.name || trialForm.name}</strong>, your demo registration is confirmed.
                  {registeredDemoInfo?.referrerName && (
                    <span className="block text-emerald-700 font-bold mt-1">
                      🎁 Referred by {registeredDemoInfo.referrerName}. Referral bonus will be approved when you enroll!
                    </span>
                  )}
                </p>

                <div className="p-3.5 rounded-xl bg-[#F8FAFD] border border-[#E2E8F0] text-xs text-[#192038] w-full text-left space-y-1">
                  <strong className="block text-slate-900 font-bold">What to do next:</strong>
                  <p className="text-[11px] text-[#64748B] m-0">
                    Visit Vidya Library anytime tomorrow with an ID proof. The admin will verify your details, collect your fee, assign your permanent desk, and your referral benefit will be credited.
                  </p>
                  <div className="pt-2 text-[11px] text-slate-700 font-medium">
                    📍 <strong>Address:</strong> 66W8+4FH, Gayatri Nagar, Gwalior, MP 474005
                  </div>
                </div>

                <button
                  onClick={closeTrialModal}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer mt-1"
                >
                  Done / Close Window
                </button>
              </div>
            )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* 9. MODERN DARK FOOTER */}
      {/* ===================================================================== */}
      <footer id="contact" className="bg-[#0B1528] text-slate-300 py-12 sm:py-16 px-4 sm:px-8 border-t border-slate-800 mt-auto text-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 pb-10 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <img
                src={vidyaLogo}
                alt="Vidya Library Logo"
                className="h-9 w-auto object-contain shrink-0"
              />
              <h3 className="text-lg font-black text-white m-0">Vidya Library</h3>
            </div>
            <p className="leading-relaxed text-slate-400">
              Vidya Library — Pin Drop Silence. Gwalior's premier air-conditioned reading lounge designed for serious competitive exam rankers.
            </p>
            <div className="mt-4 flex items-center gap-2 text-emerald-400 font-bold">
              <span>★ 4.9 Rating based on 250+ Aspirants</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-black text-white mb-3">Location & Working Hours</h4>
            <div className="flex flex-col gap-3">
              <a
                href="https://maps.google.com/?q=66W8%2B4FH,+Gayatri+Nagar,+Gwalior,+Madhya+Pradesh+474005"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-slate-300 hover:text-emerald-400 transition-colors leading-relaxed group"
              >
                <MapPin size={16} className="text-[#544bec] shrink-0 mt-0.5" />
                <span>
                  <strong className="block text-white">{settings?.address || '66W8+4FH, Gayatri Nagar, Gwalior, MP 474005'}</strong>
                  <span className="block text-[11px] text-emerald-400 font-bold mt-0.5 group-hover:underline">Open in Google Maps ↗</span>
                </span>
              </a>

              <div className="flex items-center gap-2 text-slate-300">
                <Phone size={15} className="text-[#544bec] shrink-0" />
                <a href={contactPhone.tel} className="hover:text-emerald-400 transition-colors">{contactPhone.display}</a>
              </div>

              <div className="flex items-center gap-2 text-slate-300">
                <Clock size={15} className="text-[#544bec] shrink-0" />
                <span>Open 24 Hours • 7 Days a Week (All Holidays)</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-black text-white mb-3">Front Desk & Administration</h4>
            <p className="text-slate-400 mb-4 leading-relaxed">
              Student portal login, daily punch-in, monthly fee receipts, and seat allocations.
            </p>
            <div className="flex flex-col gap-2.5">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#544bec] text-white font-bold text-xs hover:bg-[#4338ca] shadow-xs transition-colors"
              >
                <LogInIcon size={14} /> Open Admin Portal
              </Link>
              <Link
                to="/login?role=student"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 font-bold text-xs transition-colors"
              >
                <GraduationCap size={14} /> Open Student Portal
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 flex justify-between items-center flex-wrap gap-4 text-[11px] text-slate-500">
          <div>© {new Date().getFullYear()} Vidya Library. All rights reserved. Pin Drop Silence.</div>
          <div className="flex gap-4">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Admission Rules</span>
            <span className="hover:text-slate-300 cursor-pointer">Code of Conduct</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
