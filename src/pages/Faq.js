import React from 'react';
import Nav from '../components/Nav';
import styles_page from '../styles/Page.module.css';

const FAQ = () => {
    // Data array to avoid repetitive HTML blocks
    const faqData = [
        {
            id: "collapseOne",
            question: "How does ChoreSync work for neighbors?",
            answer: "ChoreSync is a community-driven marketplace. Neighbors can list services they are good at—like cooking, cleaning, or car furbishing—and others in the neighborhood can hire them directly through the platform."
        },
        {
            id: "collapseTwo",
            question: "What kind of services can I provide?",
            answer: "There are no strict criteria! Whether you are a home chef, a gardener, or someone who can help with general house chores, you can create a profile and start offering your services."
        },
        {
            id: "collapseThree",
            question: "Is the payment system secure?",
            answer: "Yes. We use Stripe to process all transactions, ensuring that your financial data is encrypted and secure."
        },
        {
            id: "collapseFour",
            question: "How do I switch to being a service provider?",
            answer: "You can easily toggle between being a customer and a provider by clicking the 'Switch to provider' link in the navigation bar to access your provider panel. You're required to sign up to provide services."
        },
        {
            id: "collapseFive",
            question: "What's next after placing a service order?",
            answer: "The provider will contact you through email to discuss further details."
        }
    ];

    return (
        <div className={styles_page.page_background}>
            <div className="row justify-content-center">
                <Nav /> 

                <div className="col-md-8 mt-4">
                    <h2 className="text-center mb-4 fw-bold">Frequently Asked Questions</h2>
                    <p className="text-center text-muted mb-5">
                        Everything you need to know about providing and receiving services on ChoreSync.
                    </p>

                    <div className="accordion accordion-flush shadow-sm border rounded" id="faqAccordion">
                        {faqData.map((item, index) => (
                            <div className="accordion-item" key={item.id}>
                                <h2 className="accordion-header">
                                    <button 
                                        className={`accordion-button ${index !== 0 ? 'collapsed' : ''}`} 
                                        type="button" 
                                        data-bs-toggle="collapse" 
                                        data-bs-target={`#${item.id}`} 
                                        aria-expanded={index === 0 ? "true" : "false"} 
                                        aria-controls={item.id}
                                    >
                                        <span className="fw-semibold">{item.question}</span>
                                    </button>
                                </h2>
                                <div 
                                    id={item.id} 
                                    className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`} 
                                    data-bs-parent="#faqAccordion"
                                >
                                    <div className="accordion-body text-secondary">
                                        {item.answer}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQ;