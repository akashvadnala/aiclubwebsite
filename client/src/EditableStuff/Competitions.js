const Competitions = {
    'inductions-b21-b20' : {
        'title':'Inductions B20-B21',
        'url':'inductions-b21-b20',
        'overview':'Welcome to the AI Club inductions. If you have made it this far, it means that you are willing to prove your passion and be one of us. This competition involves creating and running a model over the Fashion images to classify the respective Clothing. The leaderboard will show you how your model fares over the other participants and this will serve as a major criterion for this induction process Dataset The dataset includes images of various clothing that you will need to classify The evaluation metric will be the probability of the image belonging to a category. Further information can be attained by taking a peek at the sample submission file',
        'data':`About Dataset The dataset contains 6 different classes of fashion images. Each image is a 28x28 grayscale image.The original MNIST dataset contains a lot of handwritten digits. Members of the AI/ML/Data Science community love this dataset and use it as a benchmark to validate their algorithms. In fact, MNIST is often the first dataset researchers try. If it doesn't work on MNIST, it won't work at all, they said. "Well, if it does work on MNIST, it may still fail on others."Content Each image is 28 pixels in height and 28 pixels in width, for a total of 784 pixels in total. Each pixel has a single pixel-value associated with it, indicating the lightness or darkness of that pixel, with higher numbers meaning darker. This pixel-value is an integer between 0 and 255. What am I predicting? Predicting the class of a particular image File descriptions X.npy - A numpy array of training images Y.npy - A numpy array of corresponding training labels X_test.npy - A numpy array of testing images whose labels are to be predicted sampleSubmission.csv - a sample submission file in the correct format`,
        'leaderboard':'Leaderboard Tab',
        'register':'Register Tab',
        'navs': {
            'data': 'Data',
            'leaderboard':'Leaderboard',
            'register': 'Register',
        },
    },
    'other-competition' : {
        'title':'Other Competition',
        'url':'other-competition',
        'navs': {
            'data': 'Data',
            'leaderboard':'Leaderboard',
            'submissions':'Submission',
            'register': 'Register',
        },
    }
};

module.exports = Competitions;