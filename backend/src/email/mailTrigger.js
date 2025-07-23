// Centralized mail trigger functions for MotoCredit
const sendEmail = require('./mail');

/**
 * Triggers a registration email to a new customer
 */
async function triggerRegistrationEmail(to, name,password='password@12345') {
    const subject = 'Welcome to MotoCredit';
    const html = `<h1>Welcome to MotoCredit</h1><p>Dear ${name},</p><p>Your registration was successful.</p><p>Here is your login details:</p><p>Username: ${name}</p><p>Password: ${password}</p><p>url:${process.env.FRONTEND_URL}</p><p>Please keep this information safe.</p>`;
    await sendEmail(to, subject, html);
}

/**
 * Triggers a password change notification email
 */
async function triggerPasswordChangeEmail(to, name) {
    const subject = 'Your MotoCredit Password Changed';
    const html = `<h1>Password Changed</h1><p>Dear ${name},</p><p>Your password has been changed successfully.</p>`;
    await sendEmail(to, subject, html);
}

/**
 * Triggers a generic email
 */
async function triggerCustomEmail(to, subject, html) {
    await sendEmail(to, subject, html);
}

async function triggerLoanApprovalEmail(to, name, loan) {
    const subject = "Loan Approval";
    const html = `
        <h1>Congratulations, your loan has been approved!</h1>
        <p>Dear ${name},</p>
        <h3>Loan Details:</h3>
        <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
          <tr><th align="left">Loan ID</th><td>${loan.loanId}</td></tr>
          <tr><th align="left">Amount</th><td>&#8377;${loan.loanAmount?.toLocaleString() || ''}</td></tr>
          <tr><th align="left">Market Value</th><td>&#8377;${loan.marketValue?.toLocaleString() || ''}</td></tr>
          <tr><th align="left">Tenure</th><td>${loan.tenure} months</td></tr>
          <tr><th align="left">Interest Rate</th><td>${loan.interestRate}%</td></tr>
          <tr><th align="left">EMI Amount</th><td>&#8377;${loan.emiAmount?.toLocaleString() || ''}</td></tr>
          <tr><th align="left">Payment Frequency</th><td>${loan.paymentFrequency}</td></tr>
          <tr><th align="left">Next Payment Date</th><td>${loan.nextPaymentDate}</td></tr>
          <tr><th align="left">Start Date</th><td>${loan.startDate}</td></tr>
          <tr><th align="left">Processing Fee</th><td>&#8377;${loan.processingFee?.toLocaleString() || ''}</td></tr>
        </table>
        <p>Please keep this information safe. For any queries, contact our support team.</p>
        <p>Thank you for choosing MotoCredit!</p>
    `;
    await sendEmail(to, subject, html);
}

// Add more trigger functions as needed...

async function triggerAccountUpdateEmail(to, name, changes) {
    const subject = "Account Information Updated";
    let changesHtml = '';
    if (changes && typeof changes === 'object') {
        changesHtml = '<ul>' + Object.entries(changes).map(([k,v]) => `<li><b>${k}</b>: ${v}</li>`).join('') + '</ul>';
    }
    const html = `<h1>Account Updated</h1><p>Dear ${name},</p><p>Your account information has been updated:</p>${changesHtml}<p>If you did not perform this update, contact support immediately.</p>`;
    await sendEmail(to, subject, html);
}

module.exports = {
    triggerRegistrationEmail,
    triggerPasswordChangeEmail,
    triggerCustomEmail,
    triggerAccountUpdateEmail,
    triggerLoanApprovalEmail,
};
