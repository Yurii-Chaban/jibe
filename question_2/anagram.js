function buildAnagramMap(words) {
    const anagramMap = new Map();
    
    for (const word of words) {
      const sortedWord = word.split('').sort().join('');

      anagramMap.set(sortedWord, (anagramMap.get(sortedWord) || 0) + 1);
    }
    
    return anagramMap;
}

function countPhraseVariations(phrase, anagramMap) {
    const phraseWords = phrase.split(' ');
    let count = 1;

    for (const phraseWord of phraseWords) {
        const sortedPhraseWord = phraseWord.split('').sort().join('');
        count *= anagramMap.get(sortedPhraseWord) || 0;
    }

    return count;
}

function substitutions(words, phrases) {
    const anagramMap = buildAnagramMap(words);
    const substitutionsResults = [];

    for (const phrase of phrases) {
        substitutionsResults.push(countPhraseVariations(phrase, anagramMap));
    }

    return substitutionsResults;
}
  
  const words = ['desserts', 'stressed', 'bats', 'stabs', 'are', 'not'];
  const phrases = ['bats are not stressed'];
  
  const result = substitutions(words, phrases);
  console.log(result);