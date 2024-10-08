import { Insertable, Updateable } from 'kysely'
import { Card, Course, CourseStatus, Lesson, Teacher, TeacherCourse, Word } from '../kysely'

export { teachers, courses, teacherCourses }

const teachers: Insertable<Teacher>[] = [
  {
    username: 'teacher1',
    password: 'password1',
    surname: 'Garcia',
    given_name: 'Carlos',
    email: 'carlos.garcia@example.com',
    phone: '+1112223333',
    date_of_birth: new Date('1980-07-10'),
    address: '111 Walnut St, City, Country',
    avatar: 'https://example.com/avatar6.jpg',
  },
  {
    username: 'teacher2',
    password: 'password2',
    surname: 'Martinez',
    given_name: 'Luisa',
    email: 'luisa.martinez@example.com',
    phone: '+4445556666',
    date_of_birth: new Date('1972-09-12'),
    address: '222 Maple St, City, Country',
    avatar: 'https://example.com/avatar7.jpg',
  },
  {
    username: 'teacher3',
    password: 'password3',
    surname: 'Lopez',
    given_name: 'Maria',
    email: 'maria.lopez@example.com',
    phone: '+7778889999',
    date_of_birth: new Date('1983-04-18'),
    address: '333 Oak St, City, Country',
  },
]

type CardData = { text: string; audio_uri: string }

type LessonData = Partial<Lesson> & { cards?: CardData[] }

type CourseData = { id?: number } & Insertable<Course> & {
    lessons?: LessonData[]
  }

const courses: CourseData[] = [
  {
    level: 1,
    title: 'School',
    version: '1.0.0',
    status: CourseStatus.PUBLISHED,
    lessons: [
      {
        title: 'Introduction',
        audio: 'audio/intro_sql.mp3',
        content: `There are schools all around the world. There are big schools and little schools, new schools and old schools.
        Is your school big or little?
        Is your school new or old?
        *** Discover
        Now read and discover more about school!`,
        cards: [
          {
            text: 'There are schools #all around the world#.',
            audio_uri: 'audio/intro_sql.mp3',
          },
          {
            text: '#There are# big schools and little schools, new schools and old schools.',
            audio_uri: 'audio/intro_sql.mp3',
          },
          {
            text: 'Is your school #big# or #little#?',
            audio_uri: 'audio/intro_sql.mp3',
          },
          {
            text: 'Is your school #new# or #old#?',
            audio_uri: 'audio/intro_sql.mp3',
          },
          {
            text: 'Now read and discover #more# about school!',
            audio_uri: 'audio/intro_sql.mp3',
          },
        ],
      },
      {
        title: "Chapter 1: Let's Go to School",
        audio: 'audio/intro_sql.mp3',
        content: `All around the world, students go to school.
        Some students walk to school, and some go by bus or by train.
        Some students go by bicycle, and some go by car.
        These students are in the USA. They go to school by bus.
        In the snow in Canada, some students go to school by sled.
        In India, some students go to school by rickshaw.
        How do you go to school?`,
        cards: [
          {
            text: '#All around the world#, students go to school.',
            audio_uri: 'audio/intro_sql.mp3',
          },
          {
            text: 'Some students walk to school, and some go #by# bus or by train.',
            audio_uri: 'audio/intro_sql.mp3',
          },
          {
            text: 'Some students go #by# bicycle, and some go by car.',
            audio_uri: 'audio/intro_sql.mp3',
          },
          {
            text: 'These students are in #the USA#. They go to school by bus.',
            audio_uri: 'audio/intro_sql.mp3',
          },
        ],
      },
      {
        title: 'Chapter 2: Buildings',
        audio: 'audio/intro_sql.mp3',
        content: `Let's look at school buildings around the world.
        This school is in Australia.
        It's in the countryside.
        It's a little school, but many schools in Australia are big.
        Here's a big school in a city.
        Many students go to this school.
        It has a big school playground.
        This school is in South Korea.
        *** Discover
        For these students in Nepal, the countryside is their school!`,
        cards: [
          {
            text: `Let's look at school buildings #around the world#.`,
            audio_uri: 'audio/intro_sql.mp3',
          },
          {
            text: 'This school is in #Australia#.',
            audio_uri: 'audio/intro_sql.mp3',
          },
          {
            text: `It's in the #countryside#.`,
            audio_uri: 'audio/intro_sql.mp3',
          },
          {
            text: `It's a little school, but #many# schools in Australia are big.`,
            audio_uri: 'audio/intro_sql.mp3',
          },
        ],
      },
      {
        title: 'Chapter 3: At School',
        audio: 'audio/intro_sql.mp3',
        content: `These students are at school.
        They meet their friends.
        They talk and they are happy.
        Listen! That's the bell.
        Let's go to the classroom.
        The students stand in the hallway by the door.
        The teacher says, ‘Hello, everyone’.
        These students have books and notebooks.
        Can you see them?
        No, you can't.
        They are in their bags.
        *** Discover
        One school in China is in a cave.`,
      },
      {
        title: 'Chapter 4: In Class',
        audio: 'audio/intro_sql.mp3',
        content: `In the classroom, the teacher says, 'Sit down, please’.
        Open your English books.
        It's an English class.
        The teacher has a picture.
        She says, 'What's this?'
        One student says, 'It's a giraffe.'
        *** Discover
        Put up your hand when you want to speak in class.
        In some classes, students have computers.
        Do you have computers in your classroom?
        In physical education classes, students run, jump, and play.
        These girls play basketball in their physical education classes.`,
      },
    ],
  },
  {
    level: 1,
    title: 'In the Sky',
    version: '1.0.0',
    status: CourseStatus.PUBLISHED,
    lessons: [
      {
        title: 'Introduction',
        audio: 'audio/intro_sql.mp3',
        content: `Go outside and look up.
          What can you see?
          You can see the sky.
          The sky is above you.
          Look at the sky.
          Is it day or night?
          What can you see in the sky?
          ***Discover
          Now read and discover more about the sky!`,
      },
      {
        title: 'Chapter 1: The Sky',
        audio: 'audio/intro_sql.mp3',
        content: `Look at the sky in the day.
          What color is it?
          Can you see clouds?
          When it's sunny, the sky is blue.
          Clouds are white or gray.
          Sometimes you can see birds and planes.
          They fly in the sky.
          Sometimes when it's sunny and rainy, you can see a rainbow in the sky.
          How many colors can you see?
          A spacecraft goes up into the sky.
          Then it goes into space.
          Space is dark and very big.`,
      },
      {
        title: 'Chapter 2: At Night',
        audio: 'audio/intro_sql.mp3',
        content: `At night the sky is dark.
          You can see the moon.
          The moon is a big ball of rock.
          Sometimes you see a round moon.
          This is called a full moon.
          Sometimes you see different shapes.
          A thin moon is called a crescent moon.
          You can see stars at night, too.
          Stars are big, hot balls of fire.
          They look very little because they are far out in space.
          Sometimes you can see planets, too.`,
      },
      {
        title: 'Chapter 3: The Sun',
        audio: 'audio/intro_sql.mp3',
        content: `Do you know the sun is a star?
          It's our star.
          We live on a planet called Earth.
          Earth goes around the sun.
          The sun shines in the sky.
          It gives our planet light.
          Don't look at the sun.
          It isn't good for your eyes.
          The sun is very, very hot.
          It makes our planet warm so we can live here.
          ***Discover
          We get electricity from the sun!
          Light from the sun shines on solar panels.
          This makes electricity.`,
      },
      {
        title: 'Chapter 4: Day and Night',
        audio: 'audio/intro_sql.mp3',
        content: `Sometimes it's day and sometimes it's night.
          That's because Earth turns.
          When your place on Earth turns toward the sun, you see light from the sun.
          This is day.
          When your place turns away from the sun, you don't see light from the sun.
          This is night.
          Then Earth turns and it's day again.
          At night it's dark.
          It's dark in parks and gardens.
          It's dark in homes, too.
          People make light with electricity or candles.
          Is it dark when you go to bed?`,
      },
    ],
  },
  {
    level: 1,
    title: 'Fruit',
    version: '1.0.0',
    status: CourseStatus.PUBLISHED,
  },
  {
    level: 1,
    version: '1.0.0',
    title: 'Tree',
    status: CourseStatus.PUBLISHED,
  },
  {
    level: 1,
    version: '1.0.0',
    title: 'Young Animals',
    status: CourseStatus.PUBLISHED,
  },
]

const teacherCourses = new Map([
  [
    'teacher1',
    [
      { level: 1, title: 'School' },
      { level: 1, title: 'In the Sky' },
      { level: 1, title: 'Fruit' },
      { level: 1, title: 'Tree' },
      { level: 1, title: 'Young Animals' },
    ],
  ],
  ['teacher2', [{ level: 1, title: 'School' }]],
])

export const words: Insertable<Word>[] = [
  {
    text: 'there are',
    definition: 'a phrase used to indicate the existence of something',
    phonetic: 'ðɛr ɑːr',
    part_of_speech: 'phrase',
  },
  {
    text: 'all the around the word',
    definition: 'a phrase used to indicate something happening in all directions',
    phonetic: 'ɔːl ðə əˈraʊnd ðə wɜːrd',
    part_of_speech: 'phrase',
  },
  {
    text: 'big',
    definition: 'large in size or amount',
    phonetic: 'bɪɡ',
    part_of_speech: 'adjective',
  },
  {
    text: 'little',
    definition: 'small in size or amount',
    phonetic: 'ˈlɪtl',
    part_of_speech: 'adjective',
  },
  {
    text: 'new',
    definition: 'recently created, discovered, or introduced',
    phonetic: 'njuː',
    part_of_speech: 'adjective',
  },
  {
    text: 'old',
    definition: 'having lived for a long time; not new',
    phonetic: 'oʊld',
    part_of_speech: 'adjective',
  },
  {
    text: 'walk',
    definition: 'to move at a regular pace by lifting and setting down each foot in turn',
    phonetic: 'wɔːk',
    part_of_speech: 'verb',
  },
  {
    text: 'more',
    definition: 'a greater quantity or degree',
    phonetic: 'mɔːr',
    part_of_speech: 'adverb',
  },
]

export const cardWords = new Map([
  [
    'teacher1',
    [
      { level: 1, title: 'School' },
      { level: 1, title: 'In the Sky' },
      { level: 1, title: 'Fruit' },
      { level: 1, title: 'Tree' },
      { level: 1, title: 'Young Animals' },
    ],
  ],
  ['teacher2', [{ level: 1, title: 'School' }]],
])
