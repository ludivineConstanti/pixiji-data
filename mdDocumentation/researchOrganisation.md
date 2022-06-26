# Research organisation 📝

## Where should the data be stored

I wasn't sure originally, where to stock the data for the quizzes and kanjis. Originally, I kept it on the front-end side, stored in a javascript file. I then thought transferring it to the back-end could be better, since I would have access to more informations while working on the back end part (how many characters is in a quiz, verify if the answer is correct on the backend side...). In the end, I opted to keep it on the front-end side, in a json file, since the data kept growing (I added more information for each kanji), and now use a filter function to get the data I need. The back-end part now uses the id of the kanji and quizzes, and store only information that is user related and can not be kept without back-end.

## Which informations should be sent to the front end

I started by sending only the data that would be used, when the worst scores of the user are requested (those were used to display the kanjis that had the worst scores on the quizzes page, so each quiz has approximately a 100 kanjis, but only 10 or so would be needed to be displayed). This code was relying on the data for the quizzes to be present on the back-end side, to know its length, and would send the data shaped like so:

```JavaScript
{
  quiz1: {
    answer
    infosAnswer {
      answeredRight
      answeredWrong
    }
  },
  quiz2: {
    answer
    infosAnswer {
      answeredRight
      answeredWrong
    }
  },
  quiz3: {
    answer
    infosAnswer {
      answeredRight
      answeredWrong
    }
  },
}
```

Now, I added a new functionnality to the website, which displays the user score for each kanji, when clicked on, and I am currently wondering to which extent I want to rework that feature (change what is displayed depending on which time interval the user chooses: showing the worst scores from today, this month or this year...). I therefore decided to keep the feature as simple as possible (it just returns all the scores from the user that have at least been answered wrong one time), and rework it later based on either new features need or performance optimisation.

This is also better to make the code more dynamic, since I previously relied on queries that use the quizIds, which is not really a problem, since I don't plan on adding more quiz in the future, but is generally bad make the growth of the website more flexible.

### Before

```JavaScript
query: `query getWorstScores($email: String) {
            getWorstScores(input: {email: $email}) {
                quiz1 {
                    ...FragmentScore
                }
                quiz2 {
                    ...FragmentScore
                }
                quiz3 {
                    ...FragmentScore
                }
            }
        }

        fragment FragmentScore on BadScore {
        answer {
          id
          kanji
          en
          kana
          kanaEn
          quizId
        }
        infosAnswer {
          answeredRight
          answeredWrong
        }
      }`
```

### After

```JavaScript
query: `query getWorstScores($email: String) {
          scores {
  				  answer
            infosAnswer {
          	  answeredRight
  					  answeredWrong
            }
				  }
        }`
```

## Refactor the code to use the kanjiId only

This decision actually has more impact on the front-end than the back-end, since I have to restructure some components and actions to not rely on the data that is given to it, but rather use the kanjiId. For example, the MainSquare component, which is used to display kanjis (in the illustrations) and more details on hover, was conceived to always receive all the data that it should display, the quiz state was also stored in redux, so each quiz related action needs to be rewritten...

I like the new method for the MainSquare component better, since the old one was accepting 2 different data structure, and adapted to it, and the new one only accept an array with the kanjiId, which makes the code cleaner, but also make modifications for all components easier. Since all that is being passed on is the kanjiId, I can now modify the components individually, and query more or less informations thanks to graphQl, instead of having to plan the structure in advance, and needing everything to be stored with redux-toolkit.

## Before

### Informations that were in the store, for the kanjis, in the quiz

- kanjiId
- kanji
- en
- kana
- kanaEn
- quizId

### How the MainSquare component accessed that information

```JavaScript
interface IndividualKanji {
  kana: string
  kanaEn: string
  kanji: string
  kanjiId: number
  en: string[]
}

interface Answer extends IndividualKanji {
  quizId: number
}

interface KanjiFromQuiz {
  answer: Answer
  infosAnswer: {
    answerIndex: number
    answeredRight: number
    answeredWrong: number
  }
}

interface MainSquareProps {
  kanjiIndex: number
  kanjisArr: IndividualKanji[] | KanjiFromQuiz[]
}

const MainSquare = ({
  kanjiIndex,
  kanjisArr,
}: MainSquareProps) => {
  const [answer, setAnswer] = useState<KanjiRaw | false>(false)
  const [infos, setInfos] = useState<{ answeredWrong: number } | false>(false)

  // Adapts to the 2 possible data structure in the props:
  // Receiving the kanji infos directly, or having to extract it from the answer property
  useEffect(() => {
    if (!answer && kanjisArr[kanjiIndex]) {
      if (kanjisArr[kanjiIndex].answer) {
        setAnswer(kanjisArr[kanjiIndex].answer)
        setInfos(kanjisArr[kanjiIndex].infosAnswer)
      } else {
        setAnswer(kanjisArr[kanjiIndex])
      }
    } else if (!kanjisArr.length) {
      setAnswer(false)
      setInfos(false)
    }
  }, [kanjisArr])

  return (
    <SMainSquare>
      {answer && (
        <>
          <SInfos>
            <span>{answer.kana}</span>
            {answer.kanaEn}
          </SInfos>
          <SKanji>{answer.kanji}</SKanji>
          <SInfos>{answer.en[0]}</SInfos>
        </>
      )}
    </SMainSquare>
  )
}

export default MainSquare
```

## After

### Informations that are now in the store, for the kanjis, in the quiz

- kanjiId

### How the MainSquare component access that information now

```JavaScript
interface MainSquareProps {
  kanjiIndex: number
  kanjisArr: { kanjiId: number }[]
}

const MainSquare = ({
  kanjiIndex,
  kanjisArr,
}: MainSquareProps) => {
  const { allKanjisJson } = useStaticQuery(graphql`
    query {
      allKanjisJson {
        nodes {
          kanjiId
          kana
          kanaEn
          kanji
          en
        }
      }
    }
  `)

  const answer = allKanjisJson.nodes.filter(
    e => e.kanjiId === kanjisArr[kanjiIndex]
  )[0]

  return (
    <SMainSquare>
      {answer && (
        <>
          <SInfos>
            <span>{answer.kana}</span>
            {answer.kanaEn}
          </SInfos>
          <SKanji>{answer.kanji}</SKanji>
          <SInfos>{answer.en[0]}</SInfos>
        </>
      )}
    </SMainSquare>
  )
}

export default MainSquare
```

Before, every information that I wanted to add would need to be modified in the store, and then in the component (while verifying that it is not destroying the code of the other components that also use the data from the store). Now I would only need to change it in the component directly, and I do not need to worry about further implementation details that would be needed so that the data is compatible with all the components + functions that use it.
