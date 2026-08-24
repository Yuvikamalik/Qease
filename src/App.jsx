import { useEffect, useMemo, useState } from 'react'
import './App.css'

const translations = {
  en: {
    brand: 'QEase',
    tagline: 'Smart queues. Less waiting.',
    home: 'Home',
    howItWorks: 'How It Works',
    getStarted: 'Get Started',
    heroTitle: 'Skip the physical queue. Start your visit with confidence.',
    heroDescription:
      'QEase helps people plan smarter visits to hospitals, banks, schools, government offices, restaurants, and service centers without standing in unnecessary lines.',
    primaryCta: 'Get Started',
    secondaryCta: 'See How It Works',
    step1: 'Choose a place/service',
    step2: 'Join or monitor the queue',
    step3: 'Get notified when your turn approaches',
    step1Text: 'Select the service center or public place you want to visit.',
    step2Text: 'Join the queue digitally or track your position live.',
    step3Text: 'Receive timely updates when your turn is near.',
    sectionTitle: 'How QEase works',
    placesTitle: 'Built for everyday public services',
    places: ['Hospital', 'Bank', 'School/College', 'Government Office', 'Restaurant'],
    futureReady: 'Future-ready foundation',
    futureText:
      'This Phase 1 layout is designed for upcoming queue selection, staff availability, waiting-time estimates, live tracking, notifications, and admin analytics.',
    navButton: 'Get Started',
    locale: 'English',
    mobile: 'Mobile-friendly',
    live: 'Live queue status',
    trust: 'Public-service experience',
    choosePlaceTitle: 'Choose a Public Place',
    choosePlaceSubtitle: 'Select the place where you want to join or monitor a queue.',
    continueLabel: 'Continue',
    selectPrompt: 'Please select a public place to continue.',
    backLabel: 'Back',
    servicesTitle: 'Services for',
    servicesPlaceholder: 'Service selection will be available in the next phase.',
    selectionMessage: 'Selected place',
    chooseServiceTitle: 'Choose a Service',
    chooseServiceSubtitle: 'Select the exact service you want to access.',
    selectedPlaceLabel: 'Selected place',
    readyToJoinTitle: 'Ready to continue',
    readyToJoinText: 'You have selected the following service for your visit.',
    placeholderContinue: 'Back to home',
  },
  hi: {
    brand: 'QEase',
    tagline: 'स्मार्ट कतारें. कम इंतज़ार.',
    home: 'होम',
    howItWorks: 'यह कैसे काम करता है',
    getStarted: 'शुरू करें',
    heroTitle: 'भौतिक कतार छोड़ें। आत्मविश्वास के साथ अपनी यात्रा शुरू करें।',
    heroDescription:
      'QEase लोगों को अस्पताल, बैंक, स्कूल, सरकारी कार्यालय, रेस्टोरेंट और सेवा केन्द्रों पर बिना अनावश्यक लाइन में खड़े हुए स्मार्ट तरीके से विज़िट करने में मदद करता है।',
    primaryCta: 'शुरू करें',
    secondaryCta: 'यह कैसे काम करता है देखें',
    step1: 'स्थान/सेवा चुनें',
    step2: 'कतार में शामिल हों या उसकी स्थिति देखें',
    step3: 'जब आपकी बारी निकट आए, सूचना पाएं',
    step1Text: 'वह सेवा केंद्र या सार्वजनिक स्थान चुनें, जहाँ आप जाना चाहते हैं।',
    step2Text: 'डिजिटल रूप से कतार में शामिल हों या अपनी स्थिति ट्रैक करें।',
    step3Text: 'जब आपकी बारी पास आती है, तो समय पर अपडेट प्राप्त करें।',
    sectionTitle: 'QEase कैसे काम करता है',
    placesTitle: 'रोज़मर्रा की सार्वजनिक सेवाओं के लिए तैयार',
    places: ['अस्पताल', 'बैंक', 'स्कूल/कॉलेज', 'सरकारी कार्यालय', 'रेस्टोरेंट'],
    futureReady: 'भविष्य के लिए तैयार आधार',
    futureText:
      'यह Phase 1 लेआउट भविष्य के कतार चयन, स्टाफ उपलब्धता, प्रतीक्षा समय की गणना, लाइव ट्रैकिंग, नोटिफिकेशन और एडमिन एनालिटिक्स के लिए बनाया गया है।',
    navButton: 'शुरू करें',
    locale: 'हिन्दी',
    mobile: 'मोबाइल अनुकूल',
    live: 'लाइव कतार स्थिति',
    trust: 'सार्वजनिक सेवा अनुभव',
    choosePlaceTitle: 'सार्वजनिक स्थान चुनें',
    choosePlaceSubtitle:
      'वह स्थान चुनें जहाँ आप कतार में शामिल होना या कतार की स्थिति देखना चाहते हैं।',
    continueLabel: 'जारी रखें',
    selectPrompt: 'कृपया जारी रखने के लिए एक सार्वजनिक स्थान चुनें।',
    backLabel: 'पीछे',
    servicesTitle: 'की सेवाएँ',
    servicesPlaceholder: 'सेवा चयन अगले चरण में उपलब्ध होगा।',
    selectionMessage: 'चयनित स्थान',
    chooseServiceTitle: 'सेवा चुनें',
    chooseServiceSubtitle: 'उस सटीक सेवा का चयन करें जिसे आप एक्सेस करना चाहते हैं।',
    selectedPlaceLabel: 'चयनित स्थान',
    readyToJoinTitle: 'आगे बढ़ने के लिए तैयार',
    readyToJoinText: 'आपने अपनी यात्रा के लिए निम्नलिखित सेवा चुन ली है।',
    placeholderContinue: 'होम पर वापस जाएँ',
  },
}

const publicPlaces = [
  {
    id: 'hospital',
    icon: '🏥',
    name: { en: 'Hospital', hi: 'अस्पताल' },
    description: {
      en: 'Manage hospital queues and services.',
      hi: 'अस्पताल की कतारों और सेवाओं को प्रबंधित करें।',
    },
  },
  {
    id: 'bank',
    icon: '🏦',
    name: { en: 'Bank', hi: 'बैंक' },
    description: {
      en: 'Track branch service lines and wait time.',
      hi: 'शाखा सेवा लाइन और इंतज़ार समय को ट्रैक करें।',
    },
  },
  {
    id: 'school',
    icon: '🎓',
    name: { en: 'School/College', hi: 'स्कूल/कॉलेज' },
    description: {
      en: 'Coordinate student and admin service queues.',
      hi: 'विद्यार्थियों और प्रशासनिक सेवा कतारों का प्रबंधन करें।',
    },
  },
  {
    id: 'government',
    icon: '🏛️',
    name: { en: 'Government Office', hi: 'सरकारी कार्यालय' },
    description: {
      en: 'Simplify public service access and queue flow.',
      hi: 'सार्वजनिक सेवा तक पहुँच और कतार प्रवाह को सरल बनाएं।',
    },
  },
  {
    id: 'restaurant',
    icon: '🍽️',
    name: { en: 'Restaurant', hi: 'रेस्टोरेंट' },
    description: {
      en: 'Reduce waiting for dine-in and order requests.',
      hi: 'डाइन-इन और ऑर्डर अनुरोधों के लिए इंतज़ार कम करें।',
    },
  },
]

const placeIcons = ['🏥', '🏦', '🎓', '🏛️', '🍽️']

function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 620 520"
      className="hero-illustration"
      role="img"
      aria-label="Smart queue management illustration"
    >
      <defs>
        <linearGradient id="panelGradient" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e8f3ff" />
        </linearGradient>
        <linearGradient id="accentGradient" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#1F7A8C" />
          <stop offset="100%" stopColor="#5C7CFA" />
        </linearGradient>
      </defs>

      <rect x="38" y="32" width="540" height="450" rx="28" fill="url(#panelGradient)" />
      <rect x="82" y="96" width="170" height="220" rx="22" fill="#f5f7ff" stroke="#dbe7ff" strokeWidth="2" />
      <rect x="100" y="124" width="134" height="18" rx="9" fill="#dfe9ff" />
      <rect x="100" y="154" width="92" height="12" rx="6" fill="#e4ecff" />
      <rect x="100" y="184" width="116" height="82" rx="16" fill="#eff5ff" />
      <path d="M118 220h84c3 0 6 3 6 6v1c0 3-3 6-6 6h-84c-3 0-6-3-6-6v-1c0-3 3-6 6-6Z" fill="#b6c9ff" />
      <circle cx="160" cy="214" r="18" fill="#5C7CFA" opacity="0.9" />
      <path d="M186 254c0-17-17-31-38-31s-38 14-38 31" fill="none" stroke="#5C7CFA" strokeWidth="8" strokeLinecap="round" />

      <rect x="300" y="110" width="193" height="116" rx="18" fill="#ffffff" stroke="#dfe9ff" strokeWidth="2" />
      <text x="324" y="152" fill="#17324d" fontSize="18" fontWeight="700">Queue status</text>
      <rect x="324" y="171" width="136" height="18" rx="9" fill="#e7f6f1" />
      <rect x="324" y="199" width="104" height="12" rx="6" fill="#dfe9ff" />
      <rect x="324" y="219" width="118" height="12" rx="6" fill="#dfe9ff" />
      <rect x="488" y="146" width="62" height="46" rx="14" fill="url(#accentGradient)" />
      <text x="519" y="175" textAnchor="middle" fill="#ffffff" fontSize="22" fontWeight="700">A12</text>

      <rect x="300" y="260" width="250" height="134" rx="20" fill="#eef7ff" stroke="#dbe7ff" strokeWidth="2" />
      <text x="322" y="292" fill="#17324d" fontSize="18" fontWeight="700">Service desk</text>
      <rect x="320" y="312" width="70" height="52" rx="10" fill="#dff2ee" />
      <rect x="404" y="312" width="70" height="52" rx="10" fill="#e6ecff" />
      <rect x="488" y="312" width="30" height="52" rx="10" fill="#fff3db" />
      <path d="M342 340h26M430 340h26M496 340h4" stroke="#2a4d72" strokeWidth="4" strokeLinecap="round" />

      <g transform="translate(108 356)">
        <circle cx="0" cy="0" r="18" fill="#ffc7a8" />
        <path d="M22 18c0-11-10-20-22-20S-22 7-22 18v26h44V18Z" fill="#5C7CFA" />
        <circle cx="-15" cy="-7" r="5" fill="#2a4d72" />
        <circle cx="15" cy="-7" r="5" fill="#2a4d72" />
        <path d="M-10 12c5 6 20 6 30 0" stroke="#2a4d72" strokeWidth="4" strokeLinecap="round" fill="none" />
      </g>

      <g transform="translate(206 352)">
        <circle cx="0" cy="0" r="15" fill="#ffd6b5" />
        <path d="M18 18c0-9-8-17-18-17S-18 9-18 18v23h36V18Z" fill="#2bb673" />
      </g>

      <g transform="translate(458 86)">
        <circle cx="0" cy="0" r="22" fill="#ffffff" stroke="#dfe9ff" strokeWidth="2" />
        <path d="M-7 0l6 8 12-15" stroke="#22b07d" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
    </svg>
  )
}

function App() {
  const [language, setLanguage] = useState('en')
  const [view, setView] = useState(() => {
    if (typeof window === 'undefined') return 'landing'
    const params = new URLSearchParams(window.location.search)
    const currentView = params.get('view')
    return currentView === 'selection' || currentView === 'services' || currentView === 'confirmation' ? currentView : 'landing'
  })
  const [selectedPlace, setSelectedPlace] = useState(() => {
    if (typeof window === 'undefined') return null
    const params = new URLSearchParams(window.location.search)
    return params.get('place') || null
  })
  const [selectedService, setSelectedService] = useState(() => {
    if (typeof window === 'undefined') return null
    const params = new URLSearchParams(window.location.search)
    return params.get('service') || null
  })

  const content = useMemo(() => translations[language], [language])

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search)
      const route = params.get('view')
      const nextView = route === 'selection' || route === 'services' || route === 'confirmation' ? route : 'landing'
      setView(nextView)
      setSelectedPlace(params.get('place') || null)
      setSelectedService(params.get('service') || null)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const updateRoute = (nextView, nextPlace = selectedPlace, nextService = selectedService) => {
    const params = new URLSearchParams(window.location.search)

    if (nextView === 'landing') {
      params.delete('view')
      params.delete('place')
      params.delete('service')
    } else if (nextView === 'selection') {
      params.set('view', 'selection')
      if (nextPlace) params.set('place', nextPlace)
      else params.delete('place')
      params.delete('service')
    } else if (nextView === 'services') {
      params.set('view', 'services')
      if (nextPlace) params.set('place', nextPlace)
      else params.delete('place')
      params.delete('service')
    } else if (nextView === 'confirmation') {
      params.set('view', 'confirmation')
      if (nextPlace) params.set('place', nextPlace)
      else params.delete('place')
      if (nextService) params.set('service', nextService)
      else params.delete('service')
    }

    const queryString = params.toString()
    const nextUrl = `${window.location.pathname}${queryString ? `?${queryString}` : ''}`
    window.history.pushState({}, '', nextUrl)

    setView(nextView)
    setSelectedPlace(nextPlace || null)
    setSelectedService(nextService || null)
  }

  const handleGoToLanding = () => {
    updateRoute('landing', null, null)
    setTimeout(() => {
      document.getElementById('home')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 0)
  }

  const handleGoToSelection = () => {
    updateRoute('selection', selectedPlace, null)
  }

  const handleContinue = () => {
    if (!selectedPlace) return
    updateRoute('services', selectedPlace, null)
  }

  const handlePlaceSelection = (placeId) => {
    setSelectedPlace(placeId)
    setSelectedService(null)
    const params = new URLSearchParams(window.location.search)
    params.set('view', 'selection')
    params.set('place', placeId)
    params.delete('service')
    const queryString = params.toString()
    window.history.pushState({}, '', `${window.location.pathname}${queryString ? `?${queryString}` : ''}`)
  }

  const handleServiceSelection = (serviceId) => {
    setSelectedService(serviceId)
    const params = new URLSearchParams(window.location.search)
    params.set('view', 'services')
    params.set('service', serviceId)
    const queryString = params.toString()
    window.history.pushState({}, '', `${window.location.pathname}${queryString ? `?${queryString}` : ''}`)
  }

  const handleServiceContinue = () => {
    if (!selectedPlace || !selectedService) return
    updateRoute('confirmation', selectedPlace, selectedService)
  }

  const sections = [
    { step: '01', title: content.step1, text: content.step1Text },
    { step: '02', title: content.step2, text: content.step2Text },
    { step: '03', title: content.step3, text: content.step3Text },
  ]

  const selectedPlaceInfo = publicPlaces.find((place) => place.id === selectedPlace) || null
  const selectedServiceInfo =
    selectedPlaceInfo && selectedService
      ? serviceCatalog[selectedPlaceInfo.id]?.find((service) => service.id === selectedService) || null
      : null

  return (
    <div className="app-shell">
      <header className="topbar">
        <nav className="nav container" aria-label="Main navigation">
          <button type="button" className="brand brand-button" onClick={handleGoToLanding} aria-label="QEase home">
            <span className="brand-mark" aria-hidden="true">
              Q
            </span>
            <span>{content.brand}</span>
          </button>

          <div className="nav-links">
            <button type="button" className="nav-link" onClick={handleGoToLanding}>
              {content.home}
            </button>
            <button
              type="button"
              className="nav-link"
              onClick={() => {
                handleGoToLanding()
                setTimeout(() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }, 50)
              }}
            >
              {content.howItWorks}
            </button>
          </div>

          <div className="nav-actions">
            <div className="language-switch" aria-label="Language selector">
              <button
                type="button"
                className={language === 'en' ? 'active' : ''}
                onClick={() => setLanguage('en')}
                aria-pressed={language === 'en'}
              >
                English
              </button>
              <button
                type="button"
                className={language === 'hi' ? 'active' : ''}
                onClick={() => setLanguage('hi')}
                aria-pressed={language === 'hi'}
              >
                हिंदी
              </button>
            </div>
            <button type="button" className="primary-button small-button" onClick={handleGoToSelection}>
              {content.getStarted}
            </button>
          </div>
        </nav>
      </header>

      {view === 'landing' && (
        <main id="home">
          <section className="hero-section container">
            <div className="hero-copy">
              <span className="eyebrow">{content.tagline}</span>
              <h1>{content.heroTitle}</h1>
              <p>{content.heroDescription}</p>
              <div className="hero-actions">
                <button type="button" className="primary-button" onClick={handleGoToSelection}>
                  {content.primaryCta}
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    handleGoToLanding()
                    setTimeout(() => {
                      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }, 50)
                  }}
                >
                  {content.secondaryCta}
                </button>
              </div>
              <div className="mini-attributes" aria-label="QEase benefits">
                <span>{content.mobile}</span>
                <span>{content.live}</span>
                <span>{content.trust}</span>
              </div>
            </div>

            <div className="hero-visual" aria-label="Queue illustration panel">
              <HeroIllustration />
            </div>
          </section>

          <section id="how-it-works" className="how-it-works container">
            <div className="section-heading">
              <span className="eyebrow accent">{content.sectionTitle}</span>
              <h2>{content.sectionTitle}</h2>
            </div>

            <div className="steps-grid">
              {sections.map((item) => (
                <article key={item.step} className="step-card">
                  <span className="step-index">{item.step}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="places-section container">
            <div className="section-heading">
              <span className="eyebrow accent">{content.placesTitle}</span>
              <h2>{content.placesTitle}</h2>
            </div>

            <div className="places-grid">
              {content.places.map((place, index) => (
                <article key={place} className="place-card">
                  <div className="place-icon" aria-hidden="true">
                    {placeIcons[index]}
                  </div>
                  <h3>{place}</h3>
                </article>
              ))}
            </div>
          </section>

          <section className="future-section container">
            <div className="future-panel">
              <div>
                <span className="eyebrow accent">{content.futureReady}</span>
                <h2>{content.futureReady}</h2>
              </div>
              <p>{content.futureText}</p>
            </div>
          </section>
        </main>
      )}

      {view === 'selection' && (
        <main className="selection-screen container">
          <div className="screen-header">
            <div>
              <span className="eyebrow accent">{content.choosePlaceTitle}</span>
              <h2>{content.choosePlaceTitle}</h2>
            </div>
            <button type="button" className="secondary-button" onClick={handleGoToLanding}>
              {content.backLabel}
            </button>
          </div>

          <p className="screen-subtitle">{content.choosePlaceSubtitle}</p>

          <div className="selection-grid">
            {publicPlaces.map((place) => {
              const isSelected = selectedPlace === place.id

              return (
                <button
                  type="button"
                  key={place.id}
                  className={`place-selection-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handlePlaceSelection(place.id)}
                  aria-pressed={isSelected}
                >
                  <div className="selection-icon" aria-hidden="true">
                    {place.icon}
                  </div>
                  <div className="selection-copy">
                    <h3>{place.name[language]}</h3>
                    <p>{place.description[language]}</p>
                  </div>
                  <span className="selection-action">{isSelected ? '✓' : '+'}</span>
                </button>
              )
            })}
          </div>

          <div className="selection-footer">
            <button type="button" className="primary-button full-width" onClick={handleContinue} disabled={!selectedPlace}>
              {content.continueLabel}
            </button>
          </div>
        </main>
      )}

      {view === 'services' && selectedPlaceInfo && (
        <main className="selection-screen container service-screen">
          <div className="screen-header">
            <div>
              <span className="eyebrow accent">{content.selectionMessage}</span>
              <h2>
                {content.servicesTitle} {selectedPlaceInfo.name[language]}
              </h2>
            </div>
            <button type="button" className="secondary-button" onClick={() => updateRoute('selection', selectedPlace, null)}>
              {content.backLabel}
            </button>
          </div>

          <p className="screen-subtitle">{content.chooseServiceSubtitle}</p>

          <div className="selected-place-row">
            <span>{content.selectedPlaceLabel}</span>
            <strong>{selectedPlaceInfo.name[language]}</strong>
          </div>

          <div className="selection-grid service-grid">
            {serviceCatalog[selectedPlaceInfo.id].map((service) => {
              const isSelected = selectedService === service.id

              return (
                <button
                  type="button"
                  key={service.id}
                  className={`service-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleServiceSelection(service.id)}
                  aria-pressed={isSelected}
                >
                  <div className="service-icon" aria-hidden="true">
                    {service.icon}
                  </div>
                  <div className="service-copy">
                    <h3>{service.name[language]}</h3>
                    <p>{service.description[language]}</p>
                  </div>
                  <span className="service-action">{isSelected ? '✓' : '+'}</span>
                </button>
              )
            })}
          </div>

          <div className="selection-footer">
            <button type="button" className="primary-button full-width" onClick={handleServiceContinue} disabled={!selectedService}>
              {content.continueLabel}
            </button>
          </div>
        </main>
      )}

      {view === 'confirmation' && selectedPlaceInfo && selectedServiceInfo && (
        <main className="selection-screen container confirmation-screen">
          <div className="screen-header">
            <div>
              <span className="eyebrow accent">{content.readyToJoinTitle}</span>
              <h2>{content.readyToJoinTitle}</h2>
            </div>
            <button type="button" className="secondary-button" onClick={() => updateRoute('services', selectedPlace, selectedService)}>
              {content.backLabel}
            </button>
          </div>

          <div className="confirmation-panel">
            <p className="confirmation-intro">{content.readyToJoinText}</p>
            <div className="confirmation-box">
              <span>{selectedPlaceInfo.name[language]}</span>
              <strong>{selectedServiceInfo.name[language]}</strong>
            </div>
            <button type="button" className="primary-button" onClick={() => updateRoute('landing', null, null)}>
              {content.placeholderContinue}
            </button>
          </div>
        </main>
      )}
    </div>
  )
}

const serviceCatalog = {
  hospital: [
    {
      id: 'doctor-consultation',
      icon: '🩺',
      name: { en: 'Doctor Consultation', hi: 'डॉक्टर से परामर्श' },
      description: { en: 'Meet a doctor for consultation.', hi: 'डॉक्टर से परामर्श के लिए कतार में शामिल हों।' },
    },
    {
      id: 'diagnostic-tests',
      icon: '🧪',
      name: { en: 'Diagnostic Tests', hi: 'जांच / डायग्नोस्टिक टेस्ट' },
      description: { en: 'Book a test and check your queue status.', hi: 'परीक्षण बुक करें और अपनी कतार की स्थिति देखें।' },
    },
    {
      id: 'pharmacy',
      icon: '💊',
      name: { en: 'Pharmacy', hi: 'फार्मेसी' },
      description: { en: 'Collect medicines and prescription support.', hi: 'दवाइयाँ और प्रिस्क्रिप्शन सहायता प्राप्त करें।' },
    },
    {
      id: 'registration',
      icon: '📝',
      name: { en: 'Registration', hi: 'पंजीकरण' },
      description: { en: 'Register for appointments and intake forms.', hi: 'अपॉइंटमेंट और इन्टेक फॉर्म के लिए पंजीकरण करें।' },
    },
    {
      id: 'billing',
      icon: '💳',
      name: { en: 'Billing', hi: 'बिलिंग' },
      description: { en: 'Complete payment and billing steps.', hi: 'भुगतान और बिलिंग चरण पूरे करें।' },
    },
  ],
  bank: [
    {
      id: 'cash-deposit',
      icon: '💵',
      name: { en: 'Cash Deposit', hi: 'नकद जमा' },
      description: { en: 'Deposit cash for savings or account services.', hi: 'बचत या खाता सेवाओं के लिए नकद जमा करें।' },
    },
    {
      id: 'cash-withdrawal',
      icon: '🏧',
      name: { en: 'Cash Withdrawal', hi: 'नकद निकासी' },
      description: { en: 'Withdraw cash from your account quickly.', hi: 'अपने खाते से नकद जल्दी निकासी करें।' },
    },
    {
      id: 'account-services',
      icon: '📒',
      name: { en: 'Account Services', hi: 'खाता सेवाएँ' },
      description: { en: 'Update accounts and banking details.', hi: 'खाते और बैंकिंग विवरण अपडेट करें।' },
    },
    {
      id: 'loan-services',
      icon: '🏦',
      name: { en: 'Loan Services', hi: 'ऋण सेवाएँ' },
      description: { en: 'Discuss loan applications and status.', hi: 'ऋण आवेदन और स्थिति पर चर्चा करें।' },
    },
    {
      id: 'customer-support',
      icon: '🤝',
      name: { en: 'Customer Support', hi: 'ग्राहक सहायता' },
      description: { en: 'Get help with banking queries and issues.', hi: 'बैंकिंग प्रश्नों और समस्याओं के लिए सहायता प्राप्त करें।' },
    },
  ],
  school: [
    {
      id: 'admissions',
      icon: '🎓',
      name: { en: 'Admissions', hi: 'प्रवेश' },
      description: { en: 'Manage enrollment and admission requests.', hi: 'नामांकन और प्रवेश अनुरोध प्रबंधित करें।' },
    },
    {
      id: 'student-services',
      icon: '📚',
      name: { en: 'Student Services', hi: 'छात्र सेवाएँ' },
      description: { en: 'Resolve student records and support requests.', hi: 'छात्र रिकॉर्ड और सहायता अनुरोध हल करें।' },
    },
    {
      id: 'fee-counter',
      icon: '💰',
      name: { en: 'Fee Counter', hi: 'शुल्क काउंटर' },
      description: { en: 'Pay fees and complete fee-related tasks.', hi: 'शुल्क का भुगतान करें और शुल्क से संबंधित कार्य पूरे करें।' },
    },
    {
      id: 'certificates',
      icon: '📜',
      name: { en: 'Certificates', hi: 'प्रमाण पत्र' },
      description: { en: 'Request certificates and academic documents.', hi: 'प्रमाण पत्र और शैक्षणिक दस्तावेज़ अनुरोध करें।' },
    },
    {
      id: 'administration',
      icon: '🏫',
      name: { en: 'Administration', hi: 'प्रशासन' },
      description: { en: 'Contact the administration team for help.', hi: 'सहायता के लिए प्रशासन टीम से संपर्क करें।' },
    },
  ],
  government: [
    {
      id: 'document-services',
      icon: '📄',
      name: { en: 'Document Services', hi: 'दस्तावेज़ सेवाएँ' },
      description: { en: 'Submit and process official documents.', hi: 'आधिकारिक दस्तावेज़ जमा करें और प्रक्रिया करें।' },
    },
    {
      id: 'certificates-gov',
      icon: '🪪',
      name: { en: 'Certificates', hi: 'प्रमाण पत्र' },
      description: { en: 'Request identity and official certificates.', hi: 'पहचान और आधिकारिक प्रमाण पत्र का अनुरोध करें।' },
    },
    {
      id: 'applications',
      icon: '📑',
      name: { en: 'Applications', hi: 'आवेदन' },
      description: { en: 'Submit applications and status requests.', hi: 'आवेदन और स्थिति अनुरोध जमा करें।' },
    },
    {
      id: 'public-grievance',
      icon: '🗣️',
      name: { en: 'Public Grievance', hi: 'जन शिकायत' },
      description: { en: 'Raise complaints and service issues.', hi: 'शिकायतें और सेवा समस्याएँ दर्ज करें।' },
    },
    {
      id: 'general-enquiry',
      icon: '❓',
      name: { en: 'General Enquiry', hi: 'सामान्य पूछताछ' },
      description: { en: 'Ask general questions about services.', hi: 'सेवाओं के बारे में सामान्य प्रश्न पूछें।' },
    },
  ],
  restaurant: [
    {
      id: 'table-reservation',
      icon: '🪑',
      name: { en: 'Table Reservation', hi: 'टेबल आरक्षण' },
      description: { en: 'Reserve a table for your visit.', hi: 'अपनी यात्रा के लिए टेबल आरक्षित करें।' },
    },
    {
      id: 'order-counter',
      icon: '🧾',
      name: { en: 'Order Counter', hi: 'ऑर्डर काउंटर' },
      description: { en: 'Place your order and get assistance.', hi: 'ऑर्डर करें और सहायता प्राप्त करें।' },
    },
    {
      id: 'takeaway',
      icon: '🥡',
      name: { en: 'Takeaway', hi: 'टेकअवे' },
      description: { en: 'Collect food prepared for takeaway.', hi: 'टेकअवे के लिए तैयार भोजन प्राप्त करें।' },
    },
    {
      id: 'billing-restaurant',
      icon: '💳',
      name: { en: 'Billing', hi: 'बिलिंग' },
      description: { en: 'Complete payment at the billing desk.', hi: 'बिलिंग डेस्क पर भुगतान पूरा करें।' },
    },
    {
      id: 'customer-support-restaurant',
      icon: '🤝',
      name: { en: 'Customer Support', hi: 'ग्राहक सहायता' },
      description: { en: 'Get help with food, service, or orders.', hi: 'भोजन, सेवा या ऑर्डर के लिए सहायता प्राप्त करें।' },
    },
  ],
}

export default App
