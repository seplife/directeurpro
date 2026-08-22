import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SchoolRegistrationData } from '../../types';
import {
  Building2,
  GraduationCap,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Lock,
  Mail,
  Phone,
  MapPin,
  School as SchoolIcon,
  Eye,
  EyeOff,
  Bot
} from 'lucide-react';

export const AuthModule: React.FC = () => {
  const { login, registerSchoolWithStaff, registeredSchools, allUsers } = useApp();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState<string>('directeur@directeurpro.ci');
  const [loginPassword, setLoginPassword] = useState<string>('password123');

  // Registration wizard state
  const [regData, setRegData] = useState<SchoolRegistrationData>({
    school: {
      name: 'Complexe Scolaire Moderne de Cocody',
      type: 'complexe_scolaire',
      code: 'CSMC-ABJ',
      address: 'Riviera Palmeraie, Cocody',
      city: 'Abidjan',
      country: "Côte d'Ivoire",
      phone: '+225 07 12 34 56 78',
      email: 'direction@csm-cocody.ci',
      currency: 'FCFA',
      directorName: 'M. Adou Kouassi'
    },
    director: {
      firstName: 'Adou',
      lastName: 'Kouassi',
      email: 'directeur@csm-cocody.ci',
      phone: '+225 07 12 34 56 78',
      password: 'password123'
    },
    academicDirector: {
      firstName: 'Koffi',
      lastName: 'Dje',
      email: 'de@csm-cocody.ci',
      phone: '+225 05 23 45 67 89',
      cycle: 'complexe',
      password: 'password123'
    },
    educator: {
      firstName: 'Fatou',
      lastName: 'Diallo',
      email: 'educatrice@csm-cocody.ci',
      phone: '+225 01 34 56 78 90',
      assignedClassIds: ['c_6a', 'c_6b', 'c_3a', 'c_3b'],
      password: 'password123'
    }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const result = login(loginEmail, loginPassword);
    if (!result.success) {
      setErrorMessage(result.message);
    }
  };

  const handleQuickLogin = (email: string) => {
    setErrorMessage(null);
    login(email, 'password123');
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (currentStep === 1) {
      if (!regData.school.name.trim() || !regData.director.email.trim()) {
        setErrorMessage("Veuillez renseigner le nom de l'établissement et l'email du Directeur.");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!regData.academicDirector.firstName.trim() || !regData.academicDirector.email.trim()) {
        setErrorMessage("Veuillez renseigner les informations du Directeur des Études.");
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!regData.educator.firstName.trim() || !regData.educator.email.trim()) {
        setErrorMessage("Veuillez renseigner les informations de l'Éducateur.");
        return;
      }
      // Submit registration
      const res = registerSchoolWithStaff(regData);
      if (res.success) {
        setSuccessMessage(res.message);
      } else {
        setErrorMessage(res.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 md:p-8 relative overflow-hidden font-sans select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Branding */}
      <div className="text-center space-y-2 mb-8 relative z-10">
        <div className="inline-flex items-center space-x-3 bg-slate-900/80 border border-slate-800 rounded-2xl px-5 py-2.5 shadow-xl backdrop-blur-md">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-brand-500/30">
            DP
          </div>
          <div className="text-left">
            <h1 className="text-lg font-black text-white tracking-tight flex items-center space-x-1.5">
              <span>DirecteurPro</span>
              <span className="text-[10px] uppercase px-1.5 py-0.2 rounded bg-brand-950 text-brand-400 border border-brand-800 font-bold">
                SaaS IA
              </span>
            </h1>
            <span className="text-[11px] text-slate-400 block font-medium">
              Plateforme Intégrée de Gouvernance & de Pilotage Scolaire
            </span>
          </div>
        </div>
      </div>

      {/* Mode Selector Toggle */}
      <div className="flex items-center space-x-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 mb-6 relative z-10 max-w-sm w-full">
        <button
          onClick={() => {
            setAuthMode('login');
            setErrorMessage(null);
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
            authMode === 'login'
              ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Connexion
        </button>
        <button
          onClick={() => {
            setAuthMode('register');
            setErrorMessage(null);
            setCurrentStep(1);
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
            authMode === 'register'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Inscrire un Établissement
        </button>
      </div>

      {/* Alerts / Error Messages */}
      {errorMessage && (
        <div className="max-w-xl w-full mb-4 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center space-x-2">
          <span className="text-rose-400 font-black">⚠️</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="max-w-xl w-full mb-4 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. LOGIN MODE                                                             */}
      {/* ========================================================================= */}
      {authMode === 'login' && (
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl max-w-xl w-full relative z-10 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-white">Connexion à votre Espace</h2>
            <p className="text-xs text-slate-400">
              Accédez directement au Cockpit Directeur, à l'Assistant DE ou à Éducateur+ Vie Scolaire.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Adresse Email :</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="nom@directeurpro.ci"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 pl-9 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Mot de passe :</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 pl-9 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                />
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-black text-xs shadow-lg shadow-brand-600/30 flex items-center justify-center space-x-2 transition-all"
            >
              <span>SE CONNECTER AU DASHBOARD</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Selector */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Connexion Rapide (Comptes de Démonstration) :
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('directeur@directeurpro.ci')}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-brand-500 text-left transition-all group"
              >
                <span className="text-[10px] font-black uppercase text-brand-400 block">👑 Directeur</span>
                <span className="text-xs font-bold text-white block group-hover:text-brand-300 truncate">Kouamé N.</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('cde@directeurpro.ci')}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500 text-left transition-all group"
              >
                <span className="text-[10px] font-black uppercase text-cyan-400 block">📚 Directeur Études</span>
                <span className="text-xs font-bold text-white block group-hover:text-cyan-300 truncate">Awa Bakayoko</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('educateur.college@directeurpro.ci')}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500 text-left transition-all group"
              >
                <span className="text-[10px] font-black uppercase text-amber-400 block">🛡️ Éducateur+</span>
                <span className="text-xs font-bold text-white block group-hover:text-amber-300 truncate">Ibrahim Soro</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. REGISTRATION WIZARD (3 STEPS)                                          */}
      {/* ========================================================================= */}
      {authMode === 'register' && (
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl max-w-2xl w-full relative z-10 space-y-6">
          {/* Steps Indicator Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-amber-400 tracking-wider">
                Inscription Établissement • Étape {currentStep} sur 3
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                {currentStep === 1 && 'Établissement & Directeur'}
                {currentStep === 2 && 'Directeur des Études (DE)'}
                {currentStep === 3 && 'Éducateur / Vie Scolaire'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((st) => (
                <div
                  key={st}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentStep >= st ? 'bg-amber-500' : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>

          <form onSubmit={handleNextStep} className="space-y-5 text-xs">
            {/* STEP 1: ÉTABLISSEMENT & DIRECTEUR */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
                <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-black text-white">1. Identité de l'Établissement & du Directeur</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Nom de l'établissement :</label>
                    <input
                      type="text"
                      required
                      value={regData.school.name}
                      onChange={(e) =>
                        setRegData({ ...regData, school: { ...regData.school, name: e.target.value } })
                      }
                      placeholder="Ex : Complexe Scolaire d'Excellence"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Type d'établissement :</label>
                    <select
                      value={regData.school.type}
                      onChange={(e) =>
                        setRegData({
                          ...regData,
                          school: { ...regData.school, type: e.target.value as typeof regData.school.type }
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="complexe_scolaire">Complexe Scolaire (Collège + Lycée)</option>
                      <option value="college">Collège uniquement</option>
                      <option value="lycee">Lycée uniquement</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Code Établissement :</label>
                    <input
                      type="text"
                      required
                      value={regData.school.code}
                      onChange={(e) =>
                        setRegData({ ...regData, school: { ...regData.school, code: e.target.value } })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-400 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Ville :</label>
                    <input
                      type="text"
                      required
                      value={regData.school.city}
                      onChange={(e) =>
                        setRegData({ ...regData, school: { ...regData.school, city: e.target.value } })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Pays :</label>
                    <input
                      type="text"
                      required
                      value={regData.school.country}
                      onChange={(e) =>
                        setRegData({ ...regData, school: { ...regData.school, country: e.target.value } })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block">
                    Compte du Directeur Général :
                  </span>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Prénom :</label>
                      <input
                        type="text"
                        required
                        value={regData.director.firstName}
                        onChange={(e) =>
                          setRegData({
                            ...regData,
                            director: { ...regData.director, firstName: e.target.value }
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Nom :</label>
                      <input
                        type="text"
                        required
                        value={regData.director.lastName}
                        onChange={(e) =>
                          setRegData({
                            ...regData,
                            director: { ...regData.director, lastName: e.target.value }
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Email Directeur :</label>
                      <input
                        type="email"
                        required
                        value={regData.director.email}
                        onChange={(e) =>
                          setRegData({
                            ...regData,
                            director: { ...regData.director, email: e.target.value }
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Mot de passe :</label>
                      <input
                        type="password"
                        required
                        value={regData.director.password}
                        onChange={(e) =>
                          setRegData({
                            ...regData,
                            director: { ...regData.director, password: e.target.value }
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: DIRECTEUR DES ÉTUDES (DE) */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
                <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
                  <GraduationCap className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-black text-white">2. Directeur des Études (Pilotage Pédagogique)</h3>
                </div>

                <p className="text-xs text-slate-300">
                  Le Directeur des Études (DE / CDE) aura son propre accès pour gérer les progressions pédagogiques, les absences enseignants et son chronogramme dédié.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Prénom du DE :</label>
                    <input
                      type="text"
                      required
                      value={regData.academicDirector.firstName}
                      onChange={(e) =>
                        setRegData({
                          ...regData,
                          academicDirector: { ...regData.academicDirector, firstName: e.target.value }
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Nom du DE :</label>
                    <input
                      type="text"
                      required
                      value={regData.academicDirector.lastName}
                      onChange={(e) =>
                        setRegData({
                          ...regData,
                          academicDirector: { ...regData.academicDirector, lastName: e.target.value }
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Email professionnel :</label>
                    <input
                      type="email"
                      required
                      value={regData.academicDirector.email}
                      onChange={(e) =>
                        setRegData({
                          ...regData,
                          academicDirector: { ...regData.academicDirector, email: e.target.value }
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Téléphone :</label>
                    <input
                      type="tel"
                      required
                      value={regData.academicDirector.phone}
                      onChange={(e) =>
                        setRegData({
                          ...regData,
                          academicDirector: { ...regData.academicDirector, phone: e.target.value }
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Cycle supervisé :</label>
                    <select
                      value={regData.academicDirector.cycle}
                      onChange={(e) =>
                        setRegData({
                          ...regData,
                          academicDirector: {
                            ...regData.academicDirector,
                            cycle: e.target.value as typeof regData.academicDirector.cycle
                          }
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="complexe">Tous cycles (Collège & Lycée)</option>
                      <option value="college">Cycle Collège</option>
                      <option value="lycee">Cycle Lycée</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Mot de passe du compte :</label>
                    <input
                      type="password"
                      required
                      value={regData.academicDirector.password}
                      onChange={(e) =>
                        setRegData({
                          ...regData,
                          academicDirector: { ...regData.academicDirector, password: e.target.value }
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: ÉDUCATEUR / VIE SCOLAIRE */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
                <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-black text-white">3. Éducateur / Responsable de Vie Scolaire (Éducateur+)</h3>
                </div>

                <p className="text-xs text-slate-300">
                  L'Éducateur disposera de son assistant intelligent **Éducateur+** avec le chronogramme des 19 tâches, les contrôles d'assiduité, les sanctions et les alertes.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Prénom de l'Éducateur :</label>
                    <input
                      type="text"
                      required
                      value={regData.educator.firstName}
                      onChange={(e) =>
                        setRegData({
                          ...regData,
                          educator: { ...regData.educator, firstName: e.target.value }
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Nom de l'Éducateur :</label>
                    <input
                      type="text"
                      required
                      value={regData.educator.lastName}
                      onChange={(e) =>
                        setRegData({
                          ...regData,
                          educator: { ...regData.educator, lastName: e.target.value }
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Email de l'Éducateur :</label>
                    <input
                      type="email"
                      required
                      value={regData.educator.email}
                      onChange={(e) =>
                        setRegData({
                          ...regData,
                          educator: { ...regData.educator, email: e.target.value }
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Téléphone :</label>
                    <input
                      type="tel"
                      required
                      value={regData.educator.phone}
                      onChange={(e) =>
                        setRegData({
                          ...regData,
                          educator: { ...regData.educator, phone: e.target.value }
                        })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Mot de passe du compte :</label>
                  <input
                    type="password"
                    required
                    value={regData.educator.password}
                    onChange={(e) =>
                      setRegData({
                        ...regData,
                        educator: { ...regData.educator, password: e.target.value }
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center space-x-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Précédent</span>
                </button>
              ) : (
                <div />
              )}

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/30 flex items-center space-x-2"
              >
                <span>
                  {currentStep === 3 ? "FINALISER & ACCÉDER AU DASHBOARD" : "Étape Suivante"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
