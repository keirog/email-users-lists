module.exports = (query, value) => {
    const opts = {};
    const validCategories = [
        'newsletter',
        'marketing',
        'recommendation',
        'account'
    ];
    if (query.categories) {
        const categories = query.categories.split(',');
        if (categories.every(c => validCategories.includes(c))) {
            if (categories.includes('newsletter')) {
                opts['suppressedNewsletter.value'] = value;
            }
            if (categories.includes('marketing')) {
                opts['suppressedMarketing.value'] = value;
            }
            if (categories.includes('recommendation')) {
                opts['suppressedRecommendation.value'] = value;
            }
            if (categories.includes('account')) {
                opts['suppressedAccount.value'] = value;
            }
            opts['expiredUser.value'] = value;

        } else {
            throw new Error('Unsupported category in filter provided.');
        }
    } else {
        opts['suppressedNewsletter.value'] = value;
        opts['suppressedMarketing.value'] = value;
        opts['suppressedRecommendation.value'] = value;
        opts['suppressedAccount.value'] = value;
        opts['expiredUser.value'] = value;
    }
    return opts;
};