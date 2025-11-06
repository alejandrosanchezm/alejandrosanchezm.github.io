// Language Manager for CV Website
class LanguageManager {
    constructor() {
        this.currentLanguage = 'es';
        this.init();
    }

    init() {
        // Load saved language preference
        const savedLang = localStorage.getItem('cvLanguage');
        if (savedLang && ['es', 'en'].includes(savedLang)) {
            this.currentLanguage = savedLang;
        }
        
        this.setupEventListeners();
        this.updateLanguageButton();
        this.updateHTMLLang();
        
        // Wait for CV app to be fully loaded before applying translations
        this.waitForCVAppAndApplyTranslations();
    }

    waitForCVAppAndApplyTranslations() {
        // Check if CVApp is loaded and content is rendered
        const checkCVApp = () => {
            if (window.cvApp && window.CV_DATA && document.querySelector('#skillsContainer').children.length > 0) {
                // CV content is fully loaded, now apply translations
                this.updatePageContent();
                return true;
            }
            return false;
        };

        // Try immediately
        if (!checkCVApp()) {
            // If not ready, wait for DOM content and try again
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    setTimeout(() => {
                        if (!checkCVApp()) {
                            // Final attempt with longer delay
                            setTimeout(() => checkCVApp(), 500);
                        }
                    }, 100);
                });
            } else {
                // DOM is already loaded, try with small delay
                setTimeout(() => {
                    if (!checkCVApp()) {
                        setTimeout(() => checkCVApp(), 500);
                    }
                }, 100);
            }
        }
    }

    onCVContentLoaded() {
        // This method is called when CV content is fully loaded
        console.log('CV content loaded, applying translations for language:', this.currentLanguage);
        this.updatePageContent();
    }

    setupEventListeners() {
        const languageToggle = document.getElementById('languageToggle');
        if (languageToggle) {
            languageToggle.addEventListener('click', () => {
                this.toggleLanguage();
            });
        }
    }

    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'es' ? 'en' : 'es';
        localStorage.setItem('cvLanguage', this.currentLanguage);
        
        this.updateLanguageButton();
        this.updatePageContent();
        this.updateHTMLLang();
    }

    updateLanguageButton() {
        const currentFlag = document.getElementById('currentFlag');
        const currentLang = document.getElementById('currentLang');
        
        if (currentFlag && currentLang) {
            if (this.currentLanguage === 'es') {
                currentFlag.textContent = '🇪🇸';
                currentLang.textContent = 'ES';
            } else {
                currentFlag.textContent = '🇬🇧';
                currentLang.textContent = 'EN';
            }
        }
    }

    updateHTMLLang() {
        const htmlRoot = document.getElementById('htmlRoot') || document.documentElement;
        htmlRoot.lang = this.currentLanguage;
        
        // Update page title and meta description
        this.updatePageMetadata();
    }

    updatePageMetadata() {
        const personalInfo = window.CV_DATA ? window.CV_DATA.personalInfo : null;
        if (!personalInfo) return;

        // Update title
        document.title = `${personalInfo.name} - ${personalInfo.title}`;
        
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            const description = this.currentLanguage === 'es' 
                ? 'Fullstack Engineer especializado en Python y React. Experiencia en desarrollo web, Big Data y soluciones tecnológicas innovadoras.'
                : 'Fullstack Engineer specialized in Python and React. Experience in web development, Big Data and innovative technological solutions.';
            metaDescription.setAttribute('content', description);
        }
        
        // Update Open Graph meta tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            ogTitle.setAttribute('content', `${personalInfo.name} - ${personalInfo.title}`);
        }
        
        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) {
            const description = this.currentLanguage === 'es'
                ? 'Fullstack Engineer especializado en Python y React'
                : 'Fullstack Engineer specialized in Python and React';
            ogDescription.setAttribute('content', description);
        }
    }

    updatePageContent() {
        this.updateStaticTexts();
        this.updateCVData();
        
        // Trigger re-render if CVApp is available
        if (window.cvApp) {
            window.cvApp.setLanguage(this.currentLanguage);
            window.cvApp.renderContent();
        }
        
        // Update dynamic content from ActivityTracker and HeatmapTracker
        this.updateDynamicContent();
    }

    updateDynamicContent() {
        // Update ActivityTracker dynamic content
        if (window.activityTracker) {
            // Update activity summary
            if (window.activityTracker.renderSummary) {
                window.activityTracker.renderSummary();
            }
            // Update activity stats UI
            if (window.activityTracker.updateStatsUI) {
                window.activityTracker.updateStatsUI();
            }
        }
        
        // Update HeatmapTracker dynamic content
        if (window.heatmapTracker) {
            // Update interaction stats
            if (window.heatmapTracker.updateStats) {
                window.heatmapTracker.updateStats();
            }
        }
    }

    updateStaticTexts() {
        const translations = window.translations[this.currentLanguage];
        if (!translations) return;

        // Update navigation links
        this.updateNavigation(translations);
        
        // Update section headers
        this.updateSectionHeaders(translations);
        
        // Update contact section
        this.updateContactSection(translations);
        
        // Update behavioral analysis section
        this.updateBehavioralAnalysis(translations);
        
        // Update privacy banner
        this.updatePrivacyBanner(translations);
    }

    updateNavigation(translations) {
        // Mobile menu links
        const mobileMenuLinks = [
            { href: '#about', key: 'about' },
            { href: '#specialties', key: 'specialties' },
            { href: '#experience', key: 'experience' },
            { href: '#skills', key: 'skills' },
            { href: '#education', key: 'education' },
            { href: '#projects', key: 'projects' },
            { href: '#certifications', key: 'certifications' },
            { href: '#languages', key: 'languages' },
            { href: '#contact', key: 'contact' }
        ];

        mobileMenuLinks.forEach(link => {
            const element = document.querySelector(`#mobileMenu a[href="${link.href}"]`);
            if (element && translations[link.key]) {
                const textNode = element.childNodes[element.childNodes.length - 1];
                if (textNode && textNode.nodeType === Node.TEXT_NODE) {
                    textNode.textContent = translations[link.key];
                }
            }
        });

        // Sidebar tooltips
        const sidebarLinks = document.querySelectorAll('.sidebar-item .tooltip');
        const tooltipKeys = ['about', 'specialties', 'experience', 'skills', 'education', 'projects', 'certifications', 'languages', 'contact'];
        
        sidebarLinks.forEach((tooltip, index) => {
            if (tooltipKeys[index] && translations[tooltipKeys[index]]) {
                tooltip.textContent = translations[tooltipKeys[index]];
            }
        });
    }

    updateSectionHeaders(translations) {
        const sectionHeaders = [
            { selector: '#specialties .section-header', key: 'specialtiesTitle' },
            { selector: '#experience .section-header', key: 'experienceTitle' },
            { selector: '#skills .section-header', key: 'skillsTitle' },
            { selector: '#education .section-header', key: 'educationTitle' },
            { selector: '#projects .section-header', key: 'projectsTitle' },
            { selector: '#certifications .section-header', key: 'certificationsTitle' },
            { selector: '#languages .section-header', key: 'languagesTitle' }
        ];

        sectionHeaders.forEach(header => {
            const element = document.querySelector(header.selector);
            if (element && translations[header.key]) {
                element.textContent = translations[header.key];
            }
        });
    }

    updateContactSection(translations) {
        // Contact title
        const contactTitle = document.querySelector('#contact h2');
        if (contactTitle && translations.contactTitle) {
            contactTitle.textContent = translations.contactTitle;
        }

        // Contact description
        const contactDescription = document.querySelector('#contact p');
        if (contactDescription && translations.contactDescription) {
            contactDescription.textContent = translations.contactDescription;
        }

        // Contact buttons
        const emailBtn = document.querySelector('#contact a[href^="mailto:"]');
        if (emailBtn && translations.sendEmail) {
            const textNode = emailBtn.childNodes[emailBtn.childNodes.length - 1];
            if (textNode && textNode.nodeType === Node.TEXT_NODE) {
                textNode.textContent = translations.sendEmail;
            }
        }

        const phoneBtn = document.querySelector('#contact a[href^="tel:"]');
        if (phoneBtn && translations.call) {
            const textNode = phoneBtn.childNodes[phoneBtn.childNodes.length - 1];
            if (textNode && textNode.nodeType === Node.TEXT_NODE) {
                textNode.textContent = translations.call;
            }
        }
    }

    updateBehavioralAnalysis(translations) {
        // Main unlock section
        const unlockTitle = document.querySelector('#unlockContainer h3');
        if (unlockTitle && translations.behavioralAnalysis) {
            unlockTitle.textContent = translations.behavioralAnalysis;
        }

        const unlockDescription = document.querySelector('#unlockContainer p');
        if (unlockDescription && translations.behavioralDescription) {
            unlockDescription.textContent = translations.behavioralDescription;
        }

        const unlockBtn = document.querySelector('#unlockFeaturesBtn span');
        if (unlockBtn && translations.viewBehavioralAnalysis) {
            unlockBtn.textContent = translations.viewBehavioralAnalysis;
        }

        const privacyNote = document.querySelector('#privacyNote');
        if (privacyNote && translations.dataProcessedLocally) {
            privacyNote.textContent = translations.dataProcessedLocally;
        }

        // Curiosities section - Main title and description
        const curiositiesTitle = document.querySelector('#curiosities h2');
        if (curiositiesTitle && translations.whatIKnowAboutYou) {
            // Keep the icon and update only the text
            const icon = curiositiesTitle.querySelector('i');
            if (icon) {
                curiositiesTitle.innerHTML = '';
                curiositiesTitle.appendChild(icon);
                curiositiesTitle.appendChild(document.createTextNode(translations.whatIKnowAboutYou));
            } else {
                curiositiesTitle.textContent = translations.whatIKnowAboutYou;
            }
        }

        const curiositiesDescription = document.querySelector('#curiosities .relative > div > div > p');
        if (curiositiesDescription && translations.whatIKnowDescription) {
            curiositiesDescription.textContent = translations.whatIKnowDescription;
        }

        // Real-time analysis indicator
        const realTimeSpan = document.querySelector('#curiosities .font-medium');
        if (realTimeSpan && translations.realTimeAnalysis) {
            realTimeSpan.textContent = translations.realTimeAnalysis;
        }

        // Interaction Patterns section
        const interactionTitle = document.querySelector('#curiosities h3');
        if (interactionTitle && translations.interactionPatterns) {
            interactionTitle.textContent = translations.interactionPatterns;
        }

        const interactionDescription = document.querySelector('#curiosities .flex-1 p');
        if (interactionDescription && translations.interactionDescription) {
            interactionDescription.textContent = translations.interactionDescription;
        }

        // Heatmap button
        const heatmapBtnText = document.querySelector('#heatmapBtnText');
        if (heatmapBtnText && translations.viewHeatmap) {
            heatmapBtnText.textContent = translations.viewHeatmap;
        }

        // Reset buttons
        const resetButtons = document.querySelectorAll('#curiosities button');
        resetButtons.forEach(btn => {
            const btnText = btn.textContent.trim();
            if (btnText === 'Reset' && translations.reset) {
                const icon = btn.querySelector('i');
                if (icon) {
                    btn.innerHTML = '';
                    btn.appendChild(icon);
                    btn.appendChild(document.createTextNode(translations.reset));
                } else {
                    btn.textContent = translations.reset;
                }
            }
        });

        // Temporal Analysis section - Updated to use new IDs
        const temporalTitle = document.querySelector('#temporalAnalysisTitle');
        if (temporalTitle && translations.temporalAnalysis) {
            temporalTitle.textContent = translations.temporalAnalysis;
        }

        // Temporal Analysis description
        const temporalDescription = document.querySelector('#temporalDescription');
        if (temporalDescription && translations.temporalDescription) {
            temporalDescription.textContent = translations.temporalDescription;
        }

        // Intelligence Profile section
        const intelligenceTitle = document.querySelector('#curiosities h3:nth-of-type(3)');
        if (intelligenceTitle && translations.intelligentProfile) {
            intelligenceTitle.textContent = translations.intelligentProfile;
        }

        // Update analyzing text
        const analyzingElements = document.querySelectorAll('#curiosities .text-sm');
        analyzingElements.forEach(el => {
            if (el.textContent.includes('Analizando') && translations.analyzingBehavior) {
                el.textContent = translations.analyzingBehavior;
            }
        });

        // Update other behavioral analysis elements
        this.updateDetailedBehavioralElements(translations);
        
        // Update additional elements with specific selectors
        this.updateSpecificBehavioralElements(translations);
        
        // Update temporal analysis elements
        this.updateTemporalAnalysisElements(translations);
    }

    updateDetailedBehavioralElements(translations) {
        // Technical Profile
        const techProfileTitle = document.querySelector('#technicalProfileTitle');
        if (techProfileTitle && translations.technicalProfile) {
            const icon = techProfileTitle.querySelector('i');
            if (icon) {
                techProfileTitle.innerHTML = '';
                techProfileTitle.appendChild(icon);
                techProfileTitle.appendChild(document.createTextNode(translations.technicalProfile));
            } else {
                techProfileTitle.textContent = translations.technicalProfile;
            }
        }

        // Behavioral Profile
        const behavioralProfileTitle = document.querySelector('#behavioralProfileTitle');
        if (behavioralProfileTitle && translations.behavioralProfile) {
            const icon = behavioralProfileTitle.querySelector('i');
            if (icon) {
                behavioralProfileTitle.innerHTML = '';
                behavioralProfileTitle.appendChild(icon);
                behavioralProfileTitle.appendChild(document.createTextNode(translations.behavioralProfile));
            } else {
                behavioralProfileTitle.textContent = translations.behavioralProfile;
            }
        }

        // Content Analysis
        const contentAnalysisTitle = document.querySelector('#contentAnalysisTitle');
        if (contentAnalysisTitle && translations.contentAnalysis) {
            const icon = contentAnalysisTitle.querySelector('i');
            if (icon) {
                contentAnalysisTitle.innerHTML = '';
                contentAnalysisTitle.appendChild(icon);
                contentAnalysisTitle.appendChild(document.createTextNode(translations.contentAnalysis));
            } else {
                contentAnalysisTitle.textContent = translations.contentAnalysis;
            }
        }

        // Reading Pattern
        const readingPatternTitle = document.querySelector('#readingPatternTitle');
        if (readingPatternTitle && translations.readingPattern) {
            const icon = readingPatternTitle.querySelector('i');
            if (icon) {
                readingPatternTitle.innerHTML = '';
                readingPatternTitle.appendChild(icon);
                readingPatternTitle.appendChild(document.createTextNode(translations.readingPattern));
            } else {
                readingPatternTitle.textContent = translations.readingPattern;
            }
        }
    }

    updateSpecificBehavioralElements(translations) {
        // Update specific text elements with more targeted selectors
        const elementsToUpdate = [
            // Timeline elements
            { selector: '#visualTimelineTitleText', translation: 'visualTimeline' },
            { selector: '#detailedHistoryTitleText', translation: 'detailedHistory' },
            { selector: '#activityBtnText', translation: 'viewTimeline' },
            { selector: '#clearActivityDataText', translation: 'sessionReset' },
            { selector: '#activitySummaryText', translation: 'analyzingSession' },
            { selector: '#toggleIntelligencePanel span', translation: 'viewCompleteAnalysis' },
            
            // Status indicators
            { selector: '#interactionCount', translation: 'analyzingPatterns' },
            { selector: '#intelligenceSummary .text-sm', translation: 'analyzingBehavior' },
        ];

        elementsToUpdate.forEach(({ selector, translation }) => {
            const element = document.querySelector(selector);
            if (element && translations[translation]) {
                // Preserve icons if they exist
                const icon = element.querySelector('i');
                if (icon) {
                    element.innerHTML = '';
                    element.appendChild(icon);
                    element.appendChild(document.createTextNode(translations[translation]));
                } else {
                    element.textContent = translations[translation];
                }
            }
        });

        // Update buttons with specific text patterns
        const buttons = document.querySelectorAll('#curiosities button');
        buttons.forEach(btn => {
            const text = btn.textContent.trim();
            
            // Timeline buttons
            if (text.includes('Ver Timeline') && translations.viewTimeline) {
                this.updateButtonText(btn, translations.viewTimeline);
            } else if (text.includes('View Timeline') && translations.viewTimeline) {
                this.updateButtonText(btn, translations.viewTimeline);
            } else if (text.includes('Reset Sesión') && translations.sessionReset) {
                this.updateButtonText(btn, translations.sessionReset);
            } else if (text.includes('Reset Session') && translations.sessionReset) {
                this.updateButtonText(btn, translations.sessionReset);
            }
        });
    }

    updateButtonText(button, newText) {
        const icon = button.querySelector('i');
        if (icon) {
            button.innerHTML = '';
            button.appendChild(icon);
            button.appendChild(document.createTextNode(newText));
        } else {
            button.textContent = newText;
        }
    }

    updateTemporalAnalysisElements(translations) {
        // Visual Timeline title
        const visualTimelineTitleText = document.querySelector('#visualTimelineTitleText');
        if (visualTimelineTitleText && translations.visualTimeline) {
            visualTimelineTitleText.textContent = translations.visualTimeline;
        }

        // Detailed History title
        const detailedHistoryTitleText = document.querySelector('#detailedHistoryTitleText');
        if (detailedHistoryTitleText && translations.detailedHistory) {
            detailedHistoryTitleText.textContent = translations.detailedHistory;
        }

        // Update status labels using new IDs
        const activeLabel = document.querySelector('#activeStatusLabel');
        if (activeLabel && translations.active) {
            activeLabel.textContent = translations.active;
        }

        const inactiveLabel = document.querySelector('#inactiveStatusLabel');
        if (inactiveLabel && translations.inactive) {
            inactiveLabel.textContent = translations.inactive;
        }

        const awayLabel = document.querySelector('#awayStatusLabel');
        if (awayLabel && translations.away) {
            awayLabel.textContent = translations.away;
        }

        // Fallback: Update status labels by text content (for backwards compatibility)
        const statusLabels = document.querySelectorAll('#activityTimeline .text-xs span');
        statusLabels.forEach(label => {
            const text = label.textContent.trim();
            if (text === 'Activo' && translations.active) {
                label.textContent = translations.active;
            } else if (text === 'Active' && translations.active) {
                label.textContent = translations.active;
            } else if (text === 'Inactivo' && translations.inactive) {
                label.textContent = translations.inactive;
            } else if (text === 'Inactive' && translations.inactive) {
                label.textContent = translations.inactive;
            } else if (text === 'Fuera' && translations.away) {
                label.textContent = translations.away;
            } else if (text === 'Away' && translations.away) {
                label.textContent = translations.away;
            }
        });
    }

    updatePrivacyBanner(translations) {
        const privacyTitle = document.querySelector('#privacyBanner h3');
        if (privacyTitle && translations.privacyTitle) {
            privacyTitle.textContent = translations.privacyTitle;
        }

        const privacyDescription = document.querySelector('#privacyBanner p');
        if (privacyDescription && translations.privacyDescription) {
            privacyDescription.innerHTML = translations.privacyDescription;
        }

        const acceptBtn = document.querySelector('#acceptTracking');
        if (acceptBtn && translations.allowAnalysis) {
            const textSpan = acceptBtn.querySelector('span') || acceptBtn.childNodes[acceptBtn.childNodes.length - 1];
            if (textSpan) {
                if (textSpan.nodeType === Node.TEXT_NODE) {
                    textSpan.textContent = translations.allowAnalysis;
                } else {
                    textSpan.textContent = translations.allowAnalysis;
                }
            }
        }

        const declineBtn = document.querySelector('#declineTracking');
        if (declineBtn && translations.onlyNavigation) {
            const textSpan = declineBtn.querySelector('span') || declineBtn.childNodes[declineBtn.childNodes.length - 1];
            if (textSpan) {
                if (textSpan.nodeType === Node.TEXT_NODE) {
                    textSpan.textContent = translations.onlyNavigation;
                } else {
                    textSpan.textContent = translations.onlyNavigation;
                }
            }
        }
    }

    updateCVData() {
        const cvDataTranslations = window.cvDataTranslations[this.currentLanguage];
        if (!cvDataTranslations) return;

        // Update the global CV_DATA object
        if (window.CV_DATA) {
            window.CV_DATA.personalInfo = { ...window.CV_DATA.personalInfo, ...cvDataTranslations.personalInfo };
            window.CV_DATA.summary = cvDataTranslations.summary;
            window.CV_DATA.specialties = cvDataTranslations.specialties;
        }
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    getTranslation(key) {
        const translations = window.translations[this.currentLanguage];
        return translations && translations[key] ? translations[key] : key;
    }

    // Method for other components to get translated CV data
    getTranslatedCVData() {
        const cvDataTranslations = window.cvDataTranslations[this.currentLanguage];
        if (!cvDataTranslations || !window.CV_DATA) return window.CV_DATA;

        return {
            ...window.CV_DATA,
            personalInfo: cvDataTranslations.personalInfo || window.CV_DATA.personalInfo,
            summary: cvDataTranslations.summary || window.CV_DATA.summary,
            specialties: cvDataTranslations.specialties || window.CV_DATA.specialties,
            experience: cvDataTranslations.experience || window.CV_DATA.experience,
            education: cvDataTranslations.education || window.CV_DATA.education,
            projects: cvDataTranslations.projects || window.CV_DATA.projects,
            certifications: cvDataTranslations.certifications || window.CV_DATA.certifications,
            languages: cvDataTranslations.languages || window.CV_DATA.languages
        };
    }
}

// Language Manager is now initialized from the main HTML file
// to ensure proper initialization order with CVApp

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageManager;
}
