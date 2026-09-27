// Contact + waitlist settings.
export const CONTACT_EMAIL = "wearsensa@gmail.com";

// Waitlist signups are emailed to CONTACT_EMAIL via FormSubmit (formsubmit.co), which works on static hosting.
// After activating, FormSubmit emails you a random alias; put it here instead of the address to keep it out of the page.
export const WAITLIST_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;
