import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0161D8',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
      position: 'relative',
      overflow: 'hidden',
      padding: '32px 24px',
    }}>

      {/* BG circles */}
      <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%', background:'rgba(255,255,255,0.04)', top:-160, left:-140, pointerEvents:'none' }} />
      <div style={{ position:'absolute', width:350, height:350, borderRadius:'50%', background:'rgba(255,255,255,0.04)', bottom:-100, right:-80, pointerEvents:'none' }} />
      <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize:'28px 28px', pointerEvents:'none' }} />

      {/* TOP — Logo + Name + Subtitle */}
      <motion.div
        initial={{ opacity:0, y:-20 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:0.6 }}
        style={{
          display:'flex',
          flexDirection:'column',
          alignItems:'center',
          marginBottom:32,
          position:'relative',
          zIndex:1,
        }}
      >
        {/* Line 1: Logo icon + Name */}
        <div style={{
          display:'flex',
          alignItems:'center',
          gap:14,
        }}>
          {/* Logo box */}
          <div style={{
            width:52, height:52, borderRadius:14,
            background:'linear-gradient(145deg, rgba(255,255,255,0.25), rgba(255,255,255,0.08))',
            border:'2px solid rgba(255,255,255,0.35)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:26,
            boxShadow:'0 6px 20px rgba(0,0,0,0.25), inset 0 2px 0 rgba(255,255,255,0.35), inset 0 -2px 0 rgba(0,0,0,0.15)',
            flexShrink:0,
          }}>
            🤝
          </div>

          {/* NGO Name */}
          <div style={{
            fontSize:24, fontWeight:800, color:'#fff',
            letterSpacing:'0.3px', lineHeight:1,
            textShadow:'0 2px 8px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.2)',
          }}>
            Hand in Hand <span style={{ color:'#90CAF9' }}>India</span>
          </div>
        </div>

        {/* Line 2: Subtitle — centered, no vertical bar */}
        <div style={{
          marginTop:8,
          textAlign:'center',
          width:'100%',
        }}>
          <div style={{
            fontSize:10, fontWeight:700,
            color:'rgba(255,255,255,0.85)',
            letterSpacing:'2.5px',
          }}>
            ADMIN PORTAL &nbsp;·&nbsp; STAFF ACCESS ONLY
          </div>
        </div>
      </motion.div>

      {/* MAIN ROW — Video + Card same height */}
      <div style={{
        display:'flex',
        alignItems:'stretch',
        justifyContent:'center',
        gap:28,
        position:'relative',
        zIndex:1,
        width:'100%',
        maxWidth:800,
      }}>

        {/* Left — Video */}
        <motion.div
          initial={{ opacity:0, x:-30 }}
          animate={{ opacity:1, x:0 }}
          transition={{ duration:0.8 }}
          style={{
            flex:'0 0 300px',
            borderRadius:20,
            overflow:'hidden',
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
          }}
        >
          <video
            src="/src/assets/Character1.mp4"
            autoPlay
            muted
            loop
            playsInline
            style={{
              width:'100%',
              height:'100%',
              objectFit:'cover',
              display:'block',
              borderRadius:20,
            }}
          />
        </motion.div>

        {/* Right — Login Card */}
        <motion.div
          initial={{ opacity:0, y:30 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:0.7, delay:0.3 }}
          style={{
            flex:'0 0 340px',
            background:'#fff',
            borderRadius:20,
            padding:'40px 36px',
            boxShadow:'0 20px 60px rgba(0,0,0,0.25)',
            display:'flex',
            flexDirection:'column',
            justifyContent:'center',
          }}
        >
          {/* Badge */}
          <div style={{
            display:'inline-flex', alignItems:'center', gap:5,
            background:'#E3F2FD', color:'#0161D8',
            fontSize:10, fontWeight:700, borderRadius:20,
            padding:'4px 12px', marginBottom:18,
            letterSpacing:'0.8px', alignSelf:'flex-start',
          }}>
            🔐 STAFF PORTAL
          </div>

          <h2 style={{
            fontSize:24, fontWeight:700,
            color:'#01369E', marginBottom:4,
          }}>
            Welcome Back
          </h2>
          <p style={{
            fontSize:13, color:'#90A4AE', marginBottom:28,
          }}>
            Sign in to manage beneficiaries
          </p>

          {error && (
            <div style={{
              background:'#FFF3F3', color:'#D32F2F',
              border:'1px solid #FFCDD2', borderRadius:10,
              padding:'10px 14px', fontSize:13, marginBottom:16,
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom:16 }}>
            <label style={{
              display:'block', fontSize:11, fontWeight:600,
              color:'#607D8B', marginBottom:7, letterSpacing:'0.5px',
            }}>
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="staff@hihindia.org"
              style={{
                width:'100%', padding:'12px 14px',
                border:'1.5px solid #E8EEF5', borderRadius:10,
                fontSize:13, color:'#01369E',
                background:'#F8FAFF', outline:'none',
                boxSizing:'border-box' as const,
                fontFamily:'system-ui',
                transition:'border 0.2s',
              }}
              onFocus={e => e.target.style.borderColor='#0161D8'}
              onBlur={e => e.target.style.borderColor='#E8EEF5'}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom:24 }}>
            <label style={{
              display:'block', fontSize:11, fontWeight:600,
              color:'#607D8B', marginBottom:7, letterSpacing:'0.5px',
            }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••••"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{
                width:'100%', padding:'12px 14px',
                border:'1.5px solid #E8EEF5', borderRadius:10,
                fontSize:13, color:'#01369E',
                background:'#F8FAFF', outline:'none',
                boxSizing:'border-box' as const,
                fontFamily:'system-ui',
                transition:'border 0.2s',
              }}
              onFocus={e => e.target.style.borderColor='#0161D8'}
              onBlur={e => e.target.style.borderColor='#E8EEF5'}
            />
          </div>

          {/* Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width:'100%', padding:'13px',
              border:'none', borderRadius:12,
              background: loading
                ? '#90A4AE'
                : 'linear-gradient(135deg, #0161D8, #1976D2)',
              color:'#fff', fontSize:14, fontWeight:600,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow:'0 4px 16px rgba(1,97,216,0.4)',
              fontFamily:'system-ui', letterSpacing:'0.3px',
              transition:'all 0.2s',
            }}
            onMouseEnter={e => {
              if (!loading) e.currentTarget.style.transform='translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform='translateY(0)';
            }}
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>

          <div style={{ height:1, background:'#F0F4F8', margin:'20px 0' }} />

          <p style={{
            textAlign:'center', fontSize:11,
            color:'#90A4AE', fontStyle:'italic', lineHeight:1.7,
          }}>
            "Empowering women entrepreneurs<br/>through one unified platform."
          </p>

          <p style={{
            textAlign:'center', marginTop:12,
            fontSize:10, color:'#CFD8DC',
          }}>
            🔒 Authorised staff only · Hand in Hand India
          </p>
        </motion.div>
      </div>
    </div>
  );
}