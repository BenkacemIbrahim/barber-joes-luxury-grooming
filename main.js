document.addEventListener("DOMContentLoaded", () => {
    // Enhanced Services Data - FIXED: Updated first service icon
    const services = [
        {
            name: "Signature Haircut",
            price: "$50",
            duration: "45 mins",
            icon: "bx-cut", // FIXED: Changed from "bxs-cut" to "bx-cut"
            features: ["Personal Consultation", "Precision Cut", "Premium Styling", "Hot Towel Finish", "Scalp Massage"],
        },
        {
            name: "Luxury Beard Trim",
            price: "$30",
            duration: "30 mins",
            icon: "bxs-badge-check",
            features: ["Beard Shaping", "Mustache Trim", "Premium Oils", "Hot Towel Treatment", "Aftercare"],
        },
        {
            name: "Executive Grooming",
            price: "$80",
            duration: "1 hr",
            icon: "bxs-spa",
            features: ["Full Service Package", "Face Massage", "Premium Products", "Styling Consultation", "Refreshments"],
        },
        {
            name: "Hair Coloring",
            price: "from $100",
            duration: "1 hr 30 mins",
            icon: "bxs-color",
            features: ["Color Consultation", "Premium Dyes", "Deep Conditioning", "Professional Styling", "Maintenance Tips"],
        },
        {
            name: "Hot Towel Shave",
            price: "$40",
            duration: "45 mins",
            icon: "bxs-hot",
            features: ["Hot Towel Prep", "Precision Shave", "Aftershave Treatment", "Moisturizing", "Relaxation"],
        },
        {
            name: "Hair Treatment",
            price: "$60",
            duration: "1 hr",
            icon: "bxs-leaf",
            features: ["Deep Conditioning", "Scalp Analysis", "Premium Products", "Therapeutic Massage", "Styling"],
        },
    ]

    const track = document.getElementById("services-track")
    const prevBtn = document.getElementById("prev-btn")
    const nextBtn = document.getElementById("next-btn")
    const indicatorsContainer = document.getElementById("indicators")

    let currentIndex = 0
    let cardsPerView = getCardsPerView()

    function getCardsPerView() {
        if (window.innerWidth >= 1024) return 3
        if (window.innerWidth >= 768) return 2
        return 1
    }

    function createServiceCard(service, index) {
        return `
                <div class="service-card service-card-luxury" data-index="${index}">
                    <i class='bx ${service.icon} service-icon'></i>
                    <h3 class="service-title">${service.name}</h3>
                    <div class="service-price">${service.price}</div>
                    <div class="service-duration">${service.duration}</div>
                    <ul class="service-features">
                        ${service.features.map((feature) => `<li>${feature}</li>`).join("")}
                    </ul>
                    <button class="book-btn" onclick="bookService('${service.name}')">
                        <i class='bx bx-calendar mr-2'></i>Book Now
                    </button>
                </div>
            `
    }

    function createIndicators() {
        const totalSlides = Math.max(1, services.length - cardsPerView + 1)
        indicatorsContainer.innerHTML = ""

        for (let i = 0; i < totalSlides; i++) {
            const indicator = document.createElement("div")
            indicator.className = `indicator ${i === 0 ? "active" : ""}`
            indicator.addEventListener("click", () => goToSlide(i))
            indicatorsContainer.appendChild(indicator)
        }
    }

    function updateCarousel() {
        track.innerHTML = services.map(createServiceCard).join("")

        // FIXED: Better calculation for card positioning
        const isMobile = window.innerWidth <= 768
        const cardWidth = isMobile ? 300 : 370 // Fixed width including gaps

        // FIXED: Proper transform calculation
        const translateX = currentIndex * cardWidth
        track.style.transform = `translateX(-${translateX}px)`

        // Update indicators
        document.querySelectorAll(".indicator").forEach((indicator, index) => {
            indicator.classList.toggle("active", index === currentIndex)
        })

        // Update button states
        const maxIndex = Math.max(0, services.length - cardsPerView)
        prevBtn.disabled = currentIndex === 0
        nextBtn.disabled = currentIndex >= maxIndex

        // Update button opacity
        prevBtn.style.opacity = currentIndex === 0 ? "0.5" : "1"
        nextBtn.style.opacity = currentIndex >= maxIndex ? "0.5" : "1"
    }

    function goToSlide(index) {
        const maxIndex = Math.max(0, services.length - cardsPerView)
        currentIndex = Math.max(0, Math.min(index, maxIndex))
        updateCarousel()
    }

    function nextSlide() {
        const maxIndex = Math.max(0, services.length - cardsPerView)
        if (currentIndex < maxIndex) {
            currentIndex++
            updateCarousel()
        }
    }

    function prevSlide() {
        if (currentIndex > 0) {
            currentIndex--
            updateCarousel()
        }
    }

    // Event Listeners
    nextBtn.addEventListener("click", nextSlide)
    prevBtn.addEventListener("click", prevSlide)

    // FIXED: Mouse wheel scrolling for services carousel
    const servicesCarousel = document.querySelector(".services-carousel")
    let isScrollingHorizontally = false
    let scrollTimeout

    servicesCarousel.addEventListener("wheel", (e) => {
        const deltaX = Math.abs(e.deltaX)
        const deltaY = Math.abs(e.deltaY)

        // Only intercept if it's clearly a horizontal scroll gesture
        // or if user is holding Shift (common for horizontal scrolling)
        const isHorizontalIntent = deltaX > deltaY || e.shiftKey

        if (isHorizontalIntent) {
            e.preventDefault()

            // Clear any existing timeout
            clearTimeout(scrollTimeout)
            isScrollingHorizontally = true

            // Use deltaX if available (horizontal scroll), otherwise convert deltaY to horizontal movement
            const scrollDirection = e.deltaX !== 0 ? e.deltaX : e.shiftKey ? e.deltaY : 0

            if (scrollDirection > 0) {
                // Scrolling right - next slide
                nextSlide()
            } else if (scrollDirection < 0) {
                // Scrolling left - previous slide
                prevSlide()
            }

            // Reset horizontal scrolling flag after a delay
            scrollTimeout = setTimeout(() => {
                isScrollingHorizontally = false
            }, 150)
        }
        // If it's vertical scrolling, let it pass through normally for page scrolling
    })

    // Touch/Swipe Support
    let touchStartX = 0
    let touchEndX = 0
    let isDragging = false

    track.addEventListener(
        "touchstart",
        (e) => {
            touchStartX = e.touches[0].clientX
            isDragging = true
        },
        { passive: true },
    )

    track.addEventListener(
        "touchmove",
        (e) => {
            if (!isDragging) return
            touchEndX = e.touches[0].clientX
        },
        { passive: true },
    )

    track.addEventListener("touchend", () => {
        if (!isDragging) return
        isDragging = false

        const swipeThreshold = 50
        const swipeDistance = touchStartX - touchEndX

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                nextSlide()
            } else {
                prevSlide()
            }
        }
    })

    // Responsive handling
    window.addEventListener("resize", () => {
        const newCardsPerView = getCardsPerView()
        if (newCardsPerView !== cardsPerView) {
            cardsPerView = newCardsPerView
            currentIndex = 0
            createIndicators()
            updateCarousel()
        }
    })

    // Initialize
    createIndicators()
    updateCarousel()

    // Global function for booking
    window.bookService = (serviceName) => {
        // Show elegant notification
        showNotification(`Booking ${serviceName}. Redirecting to booking section...`, "success")
        setTimeout(() => {
            document.getElementById("booking").scrollIntoView({ behavior: "smooth" })
        }, 1000)
    }
})

// Enhanced Professional Calendar JavaScript
document.addEventListener("DOMContentLoaded", () => {
    // Initialize professional calendar
    initializeProfessionalCalendar()
    initializeBookingForm()
    initializeTimeSlots()
    initializeServiceSelection()
})

function initializeProfessionalCalendar() {
    const calendarEl = document.getElementById("calendar")
    const currentMonthEl = document.getElementById("current-month")
    const currentYearEl = document.getElementById("current-year")
    const prevBtn = document.getElementById("prev-month")
    const nextBtn = document.getElementById("next-month")

    const currentDate = new Date()
    let selectedDate = null

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ]

    function updateCalendarHeader() {
        currentMonthEl.textContent = months[currentDate.getMonth()]
        currentYearEl.textContent = currentDate.getFullYear()
    }

    function generateCalendar() {
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()
        const today = new Date()

        // Clear calendar
        calendarEl.innerHTML = ""

        // Create calendar grid
        const calendarGrid = document.createElement("div")
        calendarGrid.className = "grid grid-cols-7 gap-1 p-4"

        // Add day headers
        const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        dayHeaders.forEach((day) => {
            const dayHeader = document.createElement("div")
            dayHeader.className = "text-center text-sm font-semibold text-gray-500 dark:text-gray-400 py-2"
            dayHeader.textContent = day
            calendarGrid.appendChild(dayHeader)
        })

        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay()
        const daysInMonth = new Date(year, month + 1, 0).getDate()
        const daysInPrevMonth = new Date(year, month, 0).getDate()

        // Add previous month's trailing days
        for (let i = firstDay - 1; i >= 0; i--) {
            const dayEl = createDayElement(daysInPrevMonth - i, true, false)
            calendarGrid.appendChild(dayEl)
        }

        // Add current month's days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayDate = new Date(year, month, day)
            const isToday = dayDate.toDateString() === today.toDateString()
            const isPast = dayDate < today && !isToday
            const dayEl = createDayElement(day, false, isPast, isToday, dayDate)
            calendarGrid.appendChild(dayEl)
        }

        // Add next month's leading days
        const totalCells = calendarGrid.children.length - 7 // Subtract header row
        const remainingCells = 42 - totalCells // 6 rows * 7 days
        for (let day = 1; day <= remainingCells; day++) {
            const dayEl = createDayElement(day, true, false)
            calendarGrid.appendChild(dayEl)
        }

        calendarEl.appendChild(calendarGrid)
    }

    function createDayElement(day, isOtherMonth, isPast, isToday = false, fullDate = null) {
        const dayEl = document.createElement("div")
        dayEl.className = `
                fc-daygrid-day aspect-square flex items-center justify-center text-sm font-medium cursor-pointer
                transition-all duration-300 rounded-lg hover:bg-primary/10 relative
                ${isOtherMonth ? "fc-day-other-month text-gray-300" : ""}
                ${isPast ? "fc-day-past opacity-40 cursor-not-allowed" : ""}
                ${isToday ? "fc-day-today" : ""}
            `

        const dayNumber = document.createElement("span")
        dayNumber.className = "fc-daygrid-day-number"
        dayNumber.textContent = day
        dayEl.appendChild(dayNumber)

        // Add availability indicator for future dates
        if (!isOtherMonth && !isPast && fullDate) {
            const availability = getDateAvailability(fullDate)
            dayEl.classList.add(availability)
        }

        // Add click handler for selectable days
        if (!isOtherMonth && !isPast) {
            dayEl.addEventListener("click", () => selectDate(dayEl, fullDate))
        }

        return dayEl
    }

    function getDateAvailability(date) {
        // Simulate availability data
        const dayOfWeek = date.getDay()
        const random = Math.random()

        if (dayOfWeek === 0) return "limited-slots" // Sunday - limited
        if (random < 0.1) return "fully-booked"
        if (random < 0.3) return "limited-slots"
        return "available"
    }

    function selectDate(dayEl, date) {
        // Remove previous selection
        document.querySelectorAll(".fc-daygrid-day").forEach((el) => {
            el.classList.remove("fc-day-selected")
        })

        // Add selection to clicked day
        dayEl.classList.add("fc-day-selected")
        selectedDate = date

        // Update time slots
        updateTimeSlots(date)
        updateBookingSummary()

        // Show success feedback
        showDateSelectionFeedback(date)
    }

    function showDateSelectionFeedback(date) {
        const feedback = document.createElement("div")
        feedback.className =
            "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300"
        feedback.innerHTML = `
                <div class="flex items-center space-x-2">
                    <i class='bx bx-check-circle'></i>
                    <span>Date selected: ${date.toLocaleDateString()}</span>
                </div>
            `

        document.body.appendChild(feedback)

        setTimeout(() => {
            feedback.style.transform = "translateX(0)"
        }, 100)

        setTimeout(() => {
            feedback.style.transform = "translateX(100%)"
            setTimeout(() => feedback.remove(), 300)
        }, 3000)
    }

    // Navigation event listeners
    prevBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1)
        updateCalendarHeader()
        generateCalendar()
    })

    nextBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1)
        updateCalendarHeader()
        generateCalendar()
    })

    // Initialize calendar
    updateCalendarHeader()
    generateCalendar()
}

function initializeTimeSlots() {
    const timeSlotsContainer = document.getElementById("time-slots-container")

    function updateTimeSlots(selectedDate) {
        if (!selectedDate) {
            timeSlotsContainer.innerHTML =
                '<p class="text-gray-500 col-span-full text-center py-8">Please select a date first</p>'
            return
        }

        const timeSlots = generateTimeSlots(selectedDate)
        timeSlotsContainer.innerHTML = ""

        timeSlots.forEach((slot) => {
            const slotEl = document.createElement("button")
            slotEl.className = `time-slot-btn ${slot.available ? "" : "unavailable"}`
            slotEl.textContent = slot.time
            slotEl.disabled = !slot.available

            if (slot.available) {
                slotEl.addEventListener("click", () => selectTimeSlot(slotEl, slot))
            }

            timeSlotsContainer.appendChild(slotEl)
        })
    }

    function generateTimeSlots(date) {
        const slots = []
        const dayOfWeek = date.getDay()

        // Different hours for different days
        const startHour = dayOfWeek === 0 ? 12 : 9 // Sunday starts at 12 PM
        const endHour = dayOfWeek === 6 ? 18 : 20 // Saturday ends at 6 PM

        for (let hour = startHour; hour < endHour; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const time = `${hour > 12 ? hour - 12 : hour}:${minute.toString().padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`
                const available = Math.random() > 0.3 // 70% availability

                slots.push({ time, available, hour, minute })
            }
        }

        return slots
    }

    function selectTimeSlot(slotEl, slot) {
        // Remove previous selection
        document.querySelectorAll(".time-slot-btn").forEach((el) => {
            el.classList.remove("selected")
        })

        // Add selection
        slotEl.classList.add("selected")

        // Update booking summary
        updateBookingSummary()
    }

    // Make updateTimeSlots globally accessible
    window.updateTimeSlots = updateTimeSlots
}

function initializeServiceSelection() {
    const servicesContainer = document.getElementById("services-selection")

    const services = [
        {
            name: "Signature Haircut",
            price: "$50",
            duration: "45 mins",
            description: "Personal consultation, precision cut, premium styling",
        },
        {
            name: "Luxury Beard Trim",
            price: "$30",
            duration: "30 mins",
            description: "Beard shaping, mustache trim, hot towel treatment",
        },
        {
            name: "Executive Grooming",
            price: "$80",
            duration: "1 hr",
            description: "Full service package with face massage and styling",
        },
        {
            name: "Hair Coloring",
            price: "from $100",
            duration: "1 hr 30 mins",
            description: "Color consultation with premium dyes and conditioning",
        },
        {
            name: "Hot Towel Shave",
            price: "$40",
            duration: "45 mins",
            description: "Traditional hot towel shave with aftercare treatment",
        },
        {
            name: "Hair Treatment",
            price: "$60",
            duration: "1 hr",
            description: "Deep conditioning with scalp analysis and massage",
        },
    ]

    services.forEach((service, index) => {
        const serviceEl = document.createElement("div")
        serviceEl.className = "service-option"
        serviceEl.innerHTML = `
                <div class="flex items-start space-x-4">
                    <input type="radio" id="service-${index}" name="service" value="${service.name}" class="mt-1 text-primary focus:ring-primary">
                    <div class="flex-1">
                        <label for="service-${index}" class="text-lg font-semibold cursor-pointer block">${service.name}</label>
                        <div class="text-primary font-bold text-xl mt-1">${service.price} <span class="text-gray-500 text-sm font-normal">• ${service.duration}</span></div>
                        <p class="text-gray-600 dark:text-gray-300 text-sm mt-2">${service.description}</p>
                    </div>
                </div>
            `

        serviceEl.addEventListener("click", () => {
            document.getElementById(`service-${index}`).checked = true

            // Remove previous selection
            document.querySelectorAll(".service-option").forEach((el) => {
                el.classList.remove("selected")
            })

            // Add selection
            serviceEl.classList.add("selected")

            // Update booking summary
            updateBookingSummary()
        })

        servicesContainer.appendChild(serviceEl)
    })
}

function initializeBookingForm() {
    const bookButton = document.getElementById("book-appointment")

    bookButton.addEventListener("click", () => {
        const selectedService = document.querySelector('input[name="service"]:checked')
        const selectedTimeSlot = document.querySelector(".time-slot-btn.selected")
        const selectedDate = document.querySelector(".fc-day-selected")
        const clientName = document.getElementById("client-name").value
        const clientPhone = document.getElementById("client-phone").value
        const clientEmail = document.getElementById("client-email").value

        // Validation
        if (!selectedService) {
            showNotification("Please select a service", "error")
            return
        }

        if (!selectedDate) {
            showNotification("Please select a date", "error")
            return
        }

        if (!selectedTimeSlot) {
            showNotification("Please select a time slot", "error")
            return
        }

        if (!clientName || !clientPhone || !clientEmail) {
            showNotification("Please fill in all your information", "error")
            return
        }

        // Show loading state
        bookButton.classList.add("loading")
        bookButton.innerHTML = '<i class="bx bx-loader-alt animate-spin mr-2"></i><span>Processing...</span>'

        // Simulate booking process
        setTimeout(() => {
            showBookingConfirmation()
            resetBookingForm()
            bookButton.classList.remove("loading")
            bookButton.innerHTML = '<i class="bx bxs-calendar-check mr-2"></i><span>Confirm Booking</span>'
        }, 2000)
    })
}

function updateBookingSummary() {
    const selectedService = document.querySelector('input[name="service"]:checked')
    const selectedTimeSlot = document.querySelector(".time-slot-btn.selected")
    const selectedDate = document.querySelector(".fc-day-selected")
    const summaryEl = document.getElementById("booking-summary")

    if (selectedService && selectedTimeSlot && selectedDate) {
        const services = [
            { name: "Signature Haircut", price: "$50" },
            { name: "Luxury Beard Trim", price: "$30" },
            { name: "Executive Grooming", price: "$80" },
            { name: "Hair Coloring", price: "from $100" },
            { name: "Hot Towel Shave", price: "$40" },
            { name: "Hair Treatment", price: "$60" },
        ]

        const service = services.find((s) => s.name === selectedService.value)
        const dateText = new Date().toLocaleDateString() // You'd get this from the selected date

        document.getElementById("summary-service").textContent = service.name
        document.getElementById("summary-date").textContent = dateText
        document.getElementById("summary-time").textContent = selectedTimeSlot.textContent
        document.getElementById("summary-price").textContent = service.price

        summaryEl.classList.remove("hidden")
        summaryEl.classList.add("booking-summary-enter")
    } else {
        summaryEl.classList.add("hidden")
    }
}

function showBookingConfirmation() {
    const modal = document.createElement("div")
    modal.className = "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    modal.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full text-center transform scale-95 transition-transform duration-300">
                <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i class='bx bx-check text-4xl text-green-600'></i>
                </div>
                <h3 class="text-2xl font-bold luxury-title mb-4">Booking Confirmed!</h3>
                <p class="text-gray-600 dark:text-gray-300 mb-6">
                    Your appointment has been successfully booked. You'll receive a confirmation email shortly.
                </p>
                <button onclick="this.parentElement.parentElement.remove()" 
                    class="btn-luxury px-8 py-3 rounded-xl font-semibold">
                    Perfect!
                </button>
            </div>
        `

    document.body.appendChild(modal)

    setTimeout(() => {
        modal.querySelector("div").style.transform = "scale(1)"
    }, 100)
}

function resetBookingForm() {
    // Reset all form elements
    document.querySelectorAll('input[name="service"]').forEach((input) => (input.checked = false))
    document.querySelectorAll(".service-option").forEach((el) => el.classList.remove("selected"))
    document.querySelectorAll(".time-slot-btn").forEach((el) => el.classList.remove("selected"))
    document.querySelectorAll(".fc-daygrid-day").forEach((el) => el.classList.remove("fc-day-selected"))

    document.getElementById("client-name").value = ""
    document.getElementById("client-phone").value = ""
    document.getElementById("client-email").value = ""
    document.getElementById("booking-summary").classList.add("hidden")
}

// Enhanced Main JavaScript with Enhanced Mobile Menu
document.addEventListener("DOMContentLoaded", (event) => {
    const mobileMenuButton = document.getElementById("mobile-menu-button")
    const mobileMenu = document.getElementById("mobile-menu")
    const mobileMenuClose = document.getElementById("mobile-menu-close")
    const hamburgerIcon = mobileMenuButton.querySelector(".hamburger-icon")
    const themeToggle = document.getElementById("theme-toggle")
    const mobileThemeToggle = document.getElementById("mobile-theme-toggle")
    const preloader = document.getElementById("preloader")

    // Store the current scroll position when menu opens
    let scrollPosition = 0

    // Disable scrolling during preloader
    document.body.classList.add("preloader-active")

    // Enhanced mobile menu functionality with scroll prevention
    function openMobileMenu() {
        // Store current scroll position
        scrollPosition = window.pageYOffset || document.documentElement.scrollTop

        // Add classes to prevent scrolling
        mobileMenu.classList.add("active")
        hamburgerIcon.classList.add("active")
        document.body.classList.add("mobile-menu-open")

        // Set body position to prevent scroll jumping
        document.body.style.top = `-${scrollPosition}px`
    }

    function closeMobileMenu() {
        // Remove classes
        mobileMenu.classList.remove("active")
        hamburgerIcon.classList.remove("active")
        document.body.classList.remove("mobile-menu-open")

        // Restore scroll position
        document.body.style.top = ""
        window.scrollTo(0, scrollPosition)
    }

    // Mobile menu event listeners
    mobileMenuButton.addEventListener("click", openMobileMenu)
    mobileMenuClose.addEventListener("click", closeMobileMenu)

    // Close mobile menu when clicking links
    const mobileMenuLinks = mobileMenu.querySelectorAll(".mobile-menu-link")
    mobileMenuLinks.forEach((link) => {
        link.addEventListener("click", closeMobileMenu)
    })

    // Close mobile menu on escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && mobileMenu.classList.contains("active")) {
            closeMobileMenu()
        }
    })

    // Prevent scrolling on mobile menu overlay
    mobileMenu.addEventListener(
        "touchmove",
        (e) => {
            // Allow scrolling within the menu content but prevent body scroll
            if (e.target === mobileMenu) {
                e.preventDefault()
            }
        },
        { passive: false },
    )

    // Enhanced theme toggle functionality
    function toggleTheme() {
        document.documentElement.classList.toggle("dark")
        const isDark = document.documentElement.classList.contains("dark")
        localStorage.setItem("theme", isDark ? "dark" : "light")

        // Update both theme toggle icons
        updateThemeIcons(isDark)
    }

    function updateThemeIcons(isDark) {
        const iconPath = isDark
            ? "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            : "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"

        themeToggle.querySelector("path").setAttribute("d", iconPath)
        mobileThemeToggle.querySelector("path").setAttribute("d", iconPath)
    }

    themeToggle.addEventListener("click", toggleTheme)
    mobileThemeToggle.addEventListener("click", () => {
        toggleTheme()
        // Don't close menu when toggling theme
    })

    // Initialize theme
    const savedTheme = localStorage.getItem("theme")
    const systemDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme === "dark" || (!savedTheme && systemDarkMode)) {
        document.documentElement.classList.add("dark")
        updateThemeIcons(true)
    }

    // Enhanced smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault()
            const target = document.querySelector(this.getAttribute("href"))
            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                })
            }
        })
    })

    // Enhanced preloader with reduced time and scroll prevention
    window.addEventListener("load", () => {
        setTimeout(() => {
            preloader.style.opacity = "0"
            setTimeout(() => {
                preloader.style.display = "none"
                // Re-enable scrolling
                document.body.classList.remove("preloader-active")
            }, 300)
        }, 500) // Reduced from 1000ms to 500ms
    })

    // Enhanced scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1"
                entry.target.style.transform = "translateY(0)"
            }
        })
    }, observerOptions)

    // Observe all sections for animations
    document.querySelectorAll("section").forEach((section) => {
        section.style.opacity = "0"
        section.style.transform = "translateY(30px)"
        section.style.transition = "all 0.8s ease-out"
        observer.observe(section)
    })

    // Enhanced navbar scroll effect
    let lastScrollTop = 0
    const navbar = document.querySelector("nav")

    window.addEventListener("scroll", () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop

        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = "translateY(-100%)"
        } else {
            // Scrolling up
            navbar.style.transform = "translateY(0)"
        }

        // Add background blur when scrolled
        if (scrollTop > 50) {
            navbar.classList.add("backdrop-blur-xl")
        } else {
            navbar.classList.remove("backdrop-blur-xl")
        }

        lastScrollTop = scrollTop
    })
})

// Enhanced Contact Form
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contact-form")
    form.addEventListener("submit", (e) => {
        e.preventDefault()

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]')
        const originalText = submitBtn.innerHTML
        submitBtn.innerHTML = '<i class="bx bx-loader-alt animate-spin mr-2"></i><span>Sending...</span>'
        submitBtn.disabled = true

        // Simulate form submission
        setTimeout(() => {
            const formData = new FormData(form)
            console.log("Form submitted:", Object.fromEntries(formData))

            // Show success message
            showNotification("Thank you for your message! We'll get back to you within 24 hours.", "success")

            // Reset form and button
            form.reset()
            submitBtn.innerHTML = originalText
            submitBtn.disabled = false
        }, 2000)
    })
})


// Enhanced Notification System
function showNotification(message, type = "info") {
    const notification = document.createElement("div")
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 ${type === "success"
        ? "bg-green-500 text-white"
        : type === "error"
            ? "bg-red-500 text-white"
            : "bg-blue-500 text-white"
        }`

    notification.innerHTML = `
            <div class="flex items-center space-x-3">
                <i class='bx ${type === "success" ? "bx-check-circle" : type === "error" ? "bx-error-circle" : "bx-info-circle"
        } text-xl'></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                    <i class='bx bx-x text-xl'></i>
                </button>
            </div>
        `

    document.body.appendChild(notification)

    // Animate in
    setTimeout(() => {
        notification.style.transform = "translateX(0)"
    }, 100)

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = "translateX(full)"
        setTimeout(() => {
            notification.remove()
        }, 300)
    }, 5000)
}

// Enhanced Performance Optimizations
document.addEventListener("DOMContentLoaded", () => {
    // Lazy load images
    const images = document.querySelectorAll('img[loading="lazy"]')
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target
                img.src = img.dataset.src || img.src
                img.classList.remove("lazy")
                imageObserver.unobserve(img)
            }
        })
    })

    images.forEach((img) => imageObserver.observe(img))

    // Preload critical resources
    const criticalImages = [
        "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
    ]

    criticalImages.forEach((src) => {
        const link = document.createElement("link")
        link.rel = "preload"
        link.as = "image"
        link.href = src
        document.head.appendChild(link)
    })
})

// Hero Image Slideshow
document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll(".hero-slide")
    const dots = document.querySelectorAll(".hero-dot")
    let currentSlide = 0
    let slideInterval
    let isTransitioning = false

    function showSlide(index) {
        if (isTransitioning) return
        isTransitioning = true

        // Remove active class from all slides and dots
        slides.forEach((slide) => slide.classList.remove("active", "next"))
        dots.forEach((dot) => dot.classList.remove("active"))

        // Add active class to current slide and dot
        slides[index].classList.add("active")
        dots[index].classList.add("active")

        // Reset transition flag after animation
        setTimeout(() => {
            isTransitioning = false
        }, 500)
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length
        showSlide(currentSlide)
    }

    function startSlideshow() {
        slideInterval = setInterval(nextSlide, 5000) // Change image every 5 seconds
    }

    function stopSlideshow() {
        clearInterval(slideInterval)
    }

    // Initialize slideshow
    showSlide(0)
    startSlideshow()

    // Add click handlers to dots
    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            if (index !== currentSlide) {
                currentSlide = index
                showSlide(currentSlide)
                stopSlideshow()
                startSlideshow() // Restart the timer
            }
        })
    })

    // Pause slideshow on hover
    const heroSection = document.getElementById("home")
    heroSection.addEventListener("mouseenter", stopSlideshow)
    heroSection.addEventListener("mouseleave", startSlideshow)

    // Pause slideshow when page is not visible
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            stopSlideshow()
        } else {
            startSlideshow()
        }
    })

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
            currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1
            showSlide(currentSlide)
            stopSlideshow()
            startSlideshow()
        } else if (e.key === "ArrowRight") {
            nextSlide()
            stopSlideshow()
            startSlideshow()
        }
    })

    // Touch/Swipe support for mobile
    let touchStartX = 0
    let touchEndX = 0

    heroSection.addEventListener(
        "touchstart",
        (e) => {
            touchStartX = e.touches[0].clientX
        },
        { passive: true },
    )

    heroSection.addEventListener(
        "touchend",
        (e) => {
            touchEndX = e.changedTouches[0].clientX
            handleSwipe()
        },
        { passive: true },
    )

    function handleSwipe() {
        const swipeThreshold = 50
        const swipeDistance = touchStartX - touchEndX

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // Swipe left - next slide
                nextSlide()
            } else {
                // Swipe right - previous slide
                currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1
                showSlide(currentSlide)
            }
            stopSlideshow()
            startSlideshow()
        }
    }
})