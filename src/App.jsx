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
    joinQueueTitle: 'Join the Queue',
    joinQueueSubtitle: 'Check the current queue before joining.',
    currentQueue: 'Current queue',
    currentToken: 'Current token',
    peopleWaiting: 'People waiting',
    estimatedWait: 'Estimated waiting time',
    averageServiceTime: 'Average service time',
    joinQueue: 'Join Queue',
    yourQueueToken: 'Your queue token',
    nowServing: 'Now serving',
    peopleAhead: 'People ahead',
    status: 'Status',
    waiting: 'Waiting',
    leaveQueue: 'Leave Queue',
    leaveQueueConfirm: 'Are you sure you want to leave the queue?',
    queueEmpty: 'Queue information is unavailable for this selection.',
    choosePersonTitle: 'Choose a Person',
    choosePersonSubtitle: 'Select the person you want to meet and check their availability.',
    viewQueue: 'View Queue',
    currentlyBusy: 'Currently Busy',
    notAvailable: 'Not Available',
    available: 'Available',
    busy: 'Busy',
    unavailable: 'Not Available',
    availableNow: 'Available now',
    servingAnother: 'Currently serving another person',
    expectedAt: 'Expected at',
    selectedPersonLabel: 'Selected person',
    personEmpty: 'No people are available for this service yet.',
    liveQueueStatus: 'Live queue status',
    queueProgress: 'Queue progress',
    pauseSimulation: 'Pause Queue Simulation',
    resumeSimulation: 'Resume Queue Simulation',
    yourTurnApproaching: 'Your turn is approaching!',
    itsYourTurn: "It's your turn!",
    completed: 'Completed',
    queueLeft: 'Queue left',
    minutesPerPerson: 'minutes/person',
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
    joinQueueTitle: 'कतार में शामिल हों',
    joinQueueSubtitle: 'शामिल होने से पहले वर्तमान कतार की स्थिति देखें।',
    currentQueue: 'वर्तमान कतार',
    currentToken: 'वर्तमान टोकन',
    peopleWaiting: 'प्रतीक्षा कर रहे लोग',
    estimatedWait: 'अनुमानित प्रतीक्षा समय',
    averageServiceTime: 'औसत सेवा समय',
    joinQueue: 'कतार में शामिल हों',
    yourQueueToken: 'आपका कतार टोकन',
    nowServing: 'अभी सेवा में',
    peopleAhead: 'आगे लोग',
    status: 'स्थिति',
    waiting: 'प्रतीक्षा में',
    leaveQueue: 'कतार छोड़ें',
    leaveQueueConfirm: 'क्या आप वाकई कतार छोड़ना चाहते हैं?',
    queueEmpty: 'इस चयन के लिए कतार की जानकारी उपलब्ध नहीं है।',
    choosePersonTitle: 'व्यक्ति चुनें',
    choosePersonSubtitle: 'जिस व्यक्ति से आप मिलना चाहते हैं उसे चुनें और उनकी उपलब्धता देखें।',
    viewQueue: 'कतार देखें',
    currentlyBusy: 'अभी व्यस्त',
    notAvailable: 'उपलब्ध नहीं',
    available: 'उपलब्ध',
    busy: 'व्यस्त',
    unavailable: 'उपलब्ध नहीं',
    availableNow: 'अभी उपलब्ध',
    servingAnother: 'वर्तमान में किसी अन्य व्यक्ति की सेवा कर रहे हैं',
    expectedAt: 'आने की उम्मीद',
    selectedPersonLabel: 'चयनित व्यक्ति',
    personEmpty: 'इस सेवा के लिए अभी कोई व्यक्ति उपलब्ध नहीं है।',
    liveQueueStatus: 'लाइव कतार स्थिति',
    queueProgress: 'कतार प्रगति',
    pauseSimulation: 'कतार सिमुलेशन रोकें',
    resumeSimulation: 'कतार सिमुलेशन फिर शुरू करें',
    yourTurnApproaching: 'आपकी बारी नज़दीक है!',
    itsYourTurn: 'अब आपकी बारी है!',
    completed: 'पूर्ण',
    queueLeft: 'कतार छोड़ दी',
    minutesPerPerson: 'मिनट/व्यक्ति',
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

const demoQueue = {
  currentToken: 'A-18',
  peopleWaiting: 7,
  estimatedWait: 20,
  averageServiceTime: 3,
}

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
    return currentView === 'selection' || currentView === 'services' || currentView === 'confirmation' || currentView === 'queue' || currentView === 'person' ? currentView : 'landing'
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
  const [queueToken, setQueueToken] = useState(() => {
    if (typeof window === 'undefined') return null
    return new URLSearchParams(window.location.search).get('token') || null
  })
  const [selectedPerson, setSelectedPerson] = useState(() => {
    if (typeof window === 'undefined') return null
    return new URLSearchParams(window.location.search).get('person') || null
  })
  const [queueProgress, setQueueProgress] = useState({
    servingNumber: 18,
    peopleAhead: demoQueue.peopleWaiting,
  })
  const [queuePaused, setQueuePaused] = useState(false)
  const [queueAlert, setQueueAlert] = useState(null)

  const content = useMemo(() => translations[language], [language])

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search)
      const route = params.get('view')
      const nextView = route === 'selection' || route === 'services' || route === 'confirmation' || route === 'queue' || route === 'person' ? route : 'landing'
      setView(nextView)
      setSelectedPlace(params.get('place') || null)
      setSelectedService(params.get('service') || null)
      setQueueToken(params.get('token') || null)
      setSelectedPerson(params.get('person') || null)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    if (view !== 'queue' || !queueToken || queuePaused || queueProgress.peopleAhead <= 0) return undefined

    let alertTimeout
    const timer = window.setInterval(() => {
      setQueueProgress((current) => {
        const nextPeopleAhead = Math.max(0, current.peopleAhead - 1)
        const nextServingNumber = current.servingNumber + 1

        if (nextPeopleAhead === 2 || nextPeopleAhead === 0) {
          setQueueAlert(nextPeopleAhead === 0 ? 'your-turn' : 'approaching')
          window.clearTimeout(alertTimeout)
          alertTimeout = window.setTimeout(() => setQueueAlert(null), 5000)
        }

        return { servingNumber: nextServingNumber, peopleAhead: nextPeopleAhead }
      })
    }, 10000)

    return () => {
      window.clearInterval(timer)
      window.clearTimeout(alertTimeout)
    }
  }, [queuePaused, queueProgress.peopleAhead, queueToken, view])

  const updateRoute = (nextView, nextPlace = selectedPlace, nextService = selectedService) => {
    const params = new URLSearchParams(window.location.search)

    if (nextView === 'landing') {
      params.delete('view')
      params.delete('place')
      params.delete('service')
      params.delete('person')
      params.delete('token')
    } else if (nextView === 'selection') {
      params.set('view', 'selection')
      if (nextPlace) params.set('place', nextPlace)
      else params.delete('place')
      params.delete('service')
    } else if (nextView === 'services') {
      params.set('view', 'services')
      if (nextPlace) params.set('place', nextPlace)
      else params.delete('place')
      if (nextService) params.set('service', nextService)
      else params.delete('service')
      params.delete('person')
    } else if (nextView === 'confirmation') {
      params.set('view', 'confirmation')
      if (nextPlace) params.set('place', nextPlace)
      else params.delete('place')
      if (nextService) params.set('service', nextService)
      else params.delete('service')
      params.delete('person')
      params.delete('token')
    } else if (nextView === 'queue') {
      params.set('view', 'queue')
      if (nextPlace) params.set('place', nextPlace)
      else params.delete('place')
      if (nextService) params.set('service', nextService)
      else params.delete('service')
      if (nextService && queueToken) params.set('token', queueToken)
      else params.delete('token')
      if (nextService && selectedPerson) params.set('person', selectedPerson)
      else params.delete('person')
    } else if (nextView === 'person') {
      params.set('view', 'person')
      if (nextPlace) params.set('place', nextPlace)
      else params.delete('place')
      if (nextService) params.set('service', nextService)
      else params.delete('service')
      if (queueToken) params.set('token', queueToken)
      else params.delete('token')
      if (selectedPerson) params.set('person', selectedPerson)
      else params.delete('person')
    }

    const queryString = params.toString()
    const nextUrl = `${window.location.pathname}${queryString ? `?${queryString}` : ''}`
    window.history.pushState({}, '', nextUrl)

    setView(nextView)
    setSelectedPlace(nextPlace || null)
    setSelectedService(nextService || null)
    setQueueToken(nextView === 'queue' ? queueToken : null)
    setSelectedPerson(nextView === 'person' || nextView === 'queue' ? selectedPerson : null)
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
    updateRoute('queue', selectedPlace, selectedService)
  }

  const handleJoinQueue = () => {
    if (!selectedPlace || !selectedService) return
    const nextToken = `A-${Number(demoQueue.currentToken.split('-')[1]) + demoQueue.peopleWaiting + 1}`
    const params = new URLSearchParams(window.location.search)
    params.set('view', 'queue')
    params.set('place', selectedPlace)
    params.set('service', selectedService)
    params.set('token', nextToken)
    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`)
    setQueueProgress({ servingNumber: 18, peopleAhead: demoQueue.peopleWaiting })
    setQueuePaused(false)
    setQueueAlert(null)
    setQueueToken(nextToken)
  }

  const handleChoosePerson = () => {
    if (!selectedPlace || !selectedService) return
    updateRoute('person', selectedPlace, selectedService)
  }

  const handlePersonSelection = (personId) => {
    setSelectedPerson(personId)
    const params = new URLSearchParams(window.location.search)
    params.set('view', 'person')
    params.set('place', selectedPlace)
    params.set('service', selectedService)
    params.set('person', personId)
    if (queueToken) params.set('token', queueToken)
    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`)
  }

  const handlePersonContinue = () => {
    if (!selectedPerson) return
    updateRoute('queue', selectedPlace, selectedService)
  }

  const handleLeaveQueue = () => {
    if (!window.confirm(content.leaveQueueConfirm)) return
    updateRoute('services', selectedPlace, selectedService)
    setQueuePaused(true)
    setQueueAlert(null)
    setQueueProgress({ servingNumber: 18, peopleAhead: demoQueue.peopleWaiting })
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
  const peopleForService = selectedServiceInfo ? personCatalog[selectedServiceInfo.id] || [] : []
  const selectedPersonInfo = peopleForService.find((person) => person.id === selectedPerson) || null
  const currentQueueToken = `A-${queueProgress.servingNumber}`
  const estimatedQueueWait = queueProgress.peopleAhead * demoQueue.averageServiceTime
  const queueStatus = queueProgress.peopleAhead === 0 ? 'your-turn' : queueProgress.peopleAhead <= 2 ? 'approaching' : 'waiting'
  const queueProgressPercent = Math.round(((demoQueue.peopleWaiting - queueProgress.peopleAhead) / demoQueue.peopleWaiting) * 100)

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

      {view === 'queue' && selectedPlaceInfo && selectedServiceInfo && (
        <main className="selection-screen container queue-screen">
          <div className="screen-header">
            <div>
              <span className="eyebrow accent">{content.currentQueue}</span>
              <h2>{content.joinQueueTitle}</h2>
            </div>
            <button type="button" className="secondary-button" onClick={() => updateRoute('services', selectedPlace, selectedService)}>
              {content.backLabel}
            </button>
          </div>

          <p className="screen-subtitle">{content.joinQueueSubtitle}</p>

          <div className="queue-selection-summary">
            <span>{selectedPlaceInfo.name[language]}</span>
            <strong>{selectedServiceInfo.name[language]}</strong>
          </div>

          {selectedPersonInfo && (
            <div className="selected-person-summary">
              <span className="person-avatar" aria-hidden="true">{selectedPersonInfo.icon}</span>
              <div>
                <span>{content.selectedPersonLabel}</span>
                <strong>{selectedPersonInfo.name[language]}</strong>
                <small>{selectedPersonInfo.role[language]}</small>
                <small className={`selected-person-status status-${selectedPersonInfo.status}`}>
                  ● {selectedPersonInfo.status === 'available' ? content.available : selectedPersonInfo.status === 'busy' ? content.currentlyBusy : content.notAvailable}
                </small>
              </div>
            </div>
          )}

          {!queueToken ? (
            <section className="queue-info-panel" aria-labelledby="queue-info-title">
              <div className="queue-panel-heading">
                <div>
                  <span className="eyebrow accent">{content.currentQueue}</span>
                  <h3 id="queue-info-title">{content.currentQueue}</h3>
                </div>
                <span className="queue-live-indicator">● {content.live}</span>
              </div>

              <div className="queue-stats-grid">
                <article className="queue-stat-card">
                  <span className="queue-stat-icon" aria-hidden="true">🎫</span>
                  <span>{content.currentToken}</span>
                  <strong>{demoQueue.currentToken}</strong>
                </article>
                <article className="queue-stat-card">
                  <span className="queue-stat-icon" aria-hidden="true">👥</span>
                  <span>{content.peopleWaiting}</span>
                  <strong>{demoQueue.peopleWaiting}</strong>
                </article>
                <article className="queue-stat-card">
                  <span className="queue-stat-icon" aria-hidden="true">⏱️</span>
                  <span>{content.estimatedWait}</span>
                  <strong>{demoQueue.estimatedWait} {language === 'hi' ? 'मिनट' : 'minutes'}</strong>
                </article>
                <article className="queue-stat-card">
                  <span className="queue-stat-icon" aria-hidden="true">⚡</span>
                  <span>{content.averageServiceTime}</span>
                  <strong>{demoQueue.averageServiceTime} {language === 'hi' ? 'मिनट' : 'minutes'}</strong>
                </article>
              </div>

              <button type="button" className="primary-button queue-join-button" onClick={handleJoinQueue}>
                {content.joinQueue}
              </button>
              <button type="button" className="secondary-button queue-person-button" onClick={handleChoosePerson}>
                {content.choosePersonTitle}
              </button>
            </section>
          ) : (
            <section className="joined-queue-panel" aria-labelledby="joined-queue-title">
              <div className="joined-queue-heading">
                <div>
                  <span className="eyebrow accent">{content.liveQueueStatus}</span>
                  <h3 id="joined-queue-title">{content.liveQueueStatus}</h3>
                </div>
                <span className={`queue-status-badge queue-status-${queueStatus}`}>
                  {queueStatus === 'your-turn' ? content.itsYourTurn : queueStatus === 'approaching' ? content.yourTurnApproaching : content.waiting}
                </span>
              </div>

              <div className="digital-token-card">
                <span>{content.yourQueueToken}</span>
                <strong>{queueToken}</strong>
                <div className="token-status"><span className="status-dot" aria-hidden="true" />{queueStatus === 'your-turn' ? content.itsYourTurn : queueStatus === 'approaching' ? content.yourTurnApproaching : content.waiting}</div>
              </div>

              <div className="joined-queue-details">
                <div><span>{content.nowServing}</span><strong>{currentQueueToken}</strong></div>
                <div><span>{content.peopleAhead}</span><strong>{queueProgress.peopleAhead}</strong></div>
                <div><span>{content.estimatedWait}</span><strong>{estimatedQueueWait} {language === 'hi' ? 'मिनट' : 'minutes'}</strong></div>
                <div><span>{content.averageServiceTime}</span><strong>{demoQueue.averageServiceTime} {content.minutesPerPerson}</strong></div>
                <div><span>{content.status}</span><strong>{queueStatus === 'your-turn' ? content.itsYourTurn : queueStatus === 'approaching' ? content.yourTurnApproaching : content.waiting}</strong></div>
              </div>

              <div className="queue-progress-block">
                <div className="queue-progress-label"><span>{content.queueProgress}</span><strong>{queueProgressPercent}%</strong></div>
                <div className="queue-progress-track" role="progressbar" aria-valuenow={queueProgressPercent} aria-valuemin="0" aria-valuemax="100" aria-label={content.queueProgress}>
                  <span style={{ width: `${queueProgressPercent}%` }} />
                </div>
              </div>

              {queueAlert && (
                <div className="queue-alert" role="status">
                  <span aria-hidden="true">🔔</span>
                  {queueAlert === 'your-turn' ? content.itsYourTurn : content.yourTurnApproaching}
                </div>
              )}

              <button type="button" className="secondary-button leave-queue-button" onClick={handleLeaveQueue}>
                {content.leaveQueue}
              </button>
              <button type="button" className="secondary-button pause-queue-button" onClick={() => setQueuePaused((paused) => !paused)}>
                {queuePaused ? content.resumeSimulation : content.pauseSimulation}
              </button>
              <button type="button" className="secondary-button queue-person-button" onClick={handleChoosePerson}>
                {content.choosePersonTitle}
              </button>
            </section>
          )}
        </main>
      )}

      {view === 'person' && selectedPlaceInfo && selectedServiceInfo && (
        <main className="selection-screen container person-screen">
          <div className="screen-header">
            <div>
              <span className="eyebrow accent">{content.selectedPlaceLabel}</span>
              <h2>{content.choosePersonTitle}</h2>
            </div>
            <button type="button" className="secondary-button" onClick={() => updateRoute('queue', selectedPlace, selectedService)}>
              {content.backLabel}
            </button>
          </div>

          <p className="screen-subtitle">{content.choosePersonSubtitle}</p>
          <div className="queue-selection-summary">
            <span>{selectedPlaceInfo.name[language]}</span>
            <strong>{selectedServiceInfo.name[language]}</strong>
          </div>

          {peopleForService.length > 0 ? (
            <>
              <div className="person-grid">
                {peopleForService.map((person) => {
                  const isSelected = selectedPerson === person.id
                  const statusText = person.status === 'available' ? content.available : person.status === 'busy' ? content.currentlyBusy : content.notAvailable
                  const detailText = person.status === 'available' ? content.availableNow : person.status === 'busy' ? content.servingAnother : `${content.expectedAt} ${person.expectedAt}`

                  return (
                    <button
                      type="button"
                      key={person.id}
                      className={`person-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => handlePersonSelection(person.id)}
                      aria-pressed={isSelected}
                    >
                      <span className="person-avatar" aria-hidden="true">{person.icon}</span>
                      <span className="person-copy">
                        <strong>{person.name[language]}</strong>
                        <span>{person.role[language]}</span>
                        <span>{selectedServiceInfo.name[language]}</span>
                      </span>
                      <span className={`availability availability-${person.status}`}>
                        <span className="availability-dot" aria-hidden="true" />
                        <strong>{statusText}</strong>
                        <small>{detailText}</small>
                      </span>
                      <span className="person-action" aria-hidden="true">{isSelected ? '✓' : '+'}</span>
                    </button>
                  )
                })}
              </div>
              <div className="selection-footer">
                <button type="button" className="primary-button full-width" onClick={handlePersonContinue} disabled={!selectedPerson}>
                  {content.viewQueue}
                </button>
              </div>
            </>
          ) : (
            <div className="service-placeholder">
              <p>{content.personEmpty}</p>
            </div>
          )}
        </main>
      )}

      {view === 'person' && (!selectedPlaceInfo || !selectedServiceInfo) && (
        <main className="selection-screen container person-screen">
          <div className="service-placeholder">
            <p>{content.personEmpty}</p>
            <button type="button" className="primary-button" onClick={handleGoToSelection}>
              {content.getStarted}
            </button>
          </div>
        </main>
      )}

      {view === 'queue' && (!selectedPlaceInfo || !selectedServiceInfo) && (
        <main className="selection-screen container queue-screen">
          <div className="service-placeholder">
            <p>{content.queueEmpty}</p>
            <button type="button" className="primary-button" onClick={handleGoToSelection}>
              {content.getStarted}
            </button>
          </div>
        </main>
      )}

      {view === 'confirmation' && (
        <main className="selection-screen container queue-screen">
          <div className="service-placeholder">
            <p>{content.queueEmpty}</p>
            <button type="button" className="primary-button" onClick={handleGoToSelection}>
              {content.getStarted}
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

const personCatalog = {
  'doctor-consultation': [
    { id: 'ananya-sharma', icon: '👩‍⚕️', name: { en: 'Dr. Ananya Sharma', hi: 'डॉ. अनन्या शर्मा' }, role: { en: 'Senior Physician', hi: 'वरिष्ठ चिकित्सक' }, status: 'available' },
    { id: 'rahul-verma', icon: '👨‍⚕️', name: { en: 'Dr. Rahul Verma', hi: 'डॉ. राहुल वर्मा' }, role: { en: 'Cardiologist', hi: 'हृदय रोग विशेषज्ञ' }, status: 'busy' },
    { id: 'priya-mehta', icon: '👩‍⚕️', name: { en: 'Dr. Priya Mehta', hi: 'डॉ. प्रिया मेहता' }, role: { en: 'General Physician', hi: 'सामान्य चिकित्सक' }, status: 'unavailable', expectedAt: '3:00 PM' },
  ],
  pharmacy: [
    { id: 'neha-pharmacist', icon: '👩‍🔬', name: { en: 'Pharmacist Neha', hi: 'फार्मासिस्ट नेहा' }, role: { en: 'Pharmacy Specialist', hi: 'फार्मेसी विशेषज्ञ' }, status: 'available' },
    { id: 'amit-pharmacist', icon: '👨‍🔬', name: { en: 'Pharmacist Amit', hi: 'फार्मासिस्ट अमित' }, role: { en: 'Pharmacy Specialist', hi: 'फार्मेसी विशेषज्ञ' }, status: 'busy' },
  ],
  'customer-support': [
    { id: 'rohan-officer', icon: '👨‍💼', name: { en: 'Customer Officer Rohan', hi: 'ग्राहक अधिकारी रोहन' }, role: { en: 'Customer Service Officer', hi: 'ग्राहक सेवा अधिकारी' }, status: 'available' },
    { id: 'priya-officer', icon: '👩‍💼', name: { en: 'Customer Officer Priya', hi: 'ग्राहक अधिकारी प्रिया' }, role: { en: 'Customer Service Officer', hi: 'ग्राहक सेवा अधिकारी' }, status: 'busy' },
  ],
  administration: [
    { id: 'meena-admin', icon: '👩‍💼', name: { en: 'Admin Officer Meena', hi: 'प्रशासन अधिकारी मीना' }, role: { en: 'Administration Officer', hi: 'प्रशासन अधिकारी' }, status: 'available' },
    { id: 'arjun-admin', icon: '👨‍💼', name: { en: 'Admin Officer Arjun', hi: 'प्रशासन अधिकारी अर्जुन' }, role: { en: 'Administration Officer', hi: 'प्रशासन अधिकारी' }, status: 'unavailable', expectedAt: '3:00 PM' },
  ],
  'general-enquiry': [
    { id: 'rajesh-officer', icon: '👨‍💼', name: { en: 'Officer Rajesh', hi: 'अधिकारी राजेश' }, role: { en: 'Public Service Officer', hi: 'लोक सेवा अधिकारी' }, status: 'available' },
    { id: 'sunita-officer', icon: '👩‍💼', name: { en: 'Officer Sunita', hi: 'अधिकारी सुनीता' }, role: { en: 'Public Service Officer', hi: 'लोक सेवा अधिकारी' }, status: 'busy' },
  ],
  'customer-support-restaurant': [
    { id: 'amit-manager', icon: '👨‍🍳', name: { en: 'Manager Amit', hi: 'मैनेजर अमित' }, role: { en: 'Restaurant Manager', hi: 'रेस्टोरेंट मैनेजर' }, status: 'available' },
    { id: 'neha-manager', icon: '👩‍🍳', name: { en: 'Manager Neha', hi: 'मैनेजर नेहा' }, role: { en: 'Restaurant Manager', hi: 'रेस्टोरेंट मैनेजर' }, status: 'busy' },
  ],
}

export default App
