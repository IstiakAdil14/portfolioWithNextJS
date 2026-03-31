// Run with: node seed.mjs
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env.local') });

await mongoose.connect(process.env.MONGODB_URI);
console.log('✅ Connected to MongoDB');

// ── Schemas ──────────────────────────────────────────────
const ExpertiseSchema = new mongoose.Schema({ title: String, desc: String, order: Number }, { timestamps: true });
const ProjectSchema = new mongoose.Schema({ projectName: String, projectDetail: String, image: String, url: String, githubUrl: String, technologiesUsed: [{ tech: String }], order: Number }, { timestamps: true });
const BackgroundSchema = new mongoose.Schema({ eduCards: Array, expCards: Array }, { timestamps: true });
const SkillSchema = new mongoose.Schema({ title: String, level: String, order: Number }, { timestamps: true });
const MetaSchema = new mongoose.Schema({ key: { type: String, unique: true }, value: mongoose.Schema.Types.Mixed }, { timestamps: true });

const Expertise = mongoose.models.Expertise || mongoose.model('Expertise', ExpertiseSchema);
const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
const Background = mongoose.models.Background || mongoose.model('Background', BackgroundSchema);
const Skill = mongoose.models.Skill || mongoose.model('Skill', SkillSchema);
const Meta = mongoose.models.Meta || mongoose.model('Meta', MetaSchema);

// ── Clear existing data ───────────────────────────────────
await Promise.all([
    Expertise.deleteMany({}),
    Project.deleteMany({}),
    Background.deleteMany({}),
    Skill.deleteMany({}),
    Meta.deleteMany({}),
]);
console.log('🗑️  Cleared existing data');

// ── Expertise ─────────────────────────────────────────────
await Expertise.insertMany([
    { title: 'Full Stack Development', order: 0, desc: 'I am a skilled MERN stack developer with extensive experience in building robust web applications using MongoDB, Express.js, React.js, and Node.js. I possess a strong understanding of server-side rendering, API integration, and database management. With my expertise, I can deliver dynamic and efficient web solutions tailored to meet the unique requirements of clients.' },
    { title: 'Github', order: 1, desc: 'GitHub is essential for version control and collaboration. Its intuitive interface and features like pull requests and issue tracking simplify the process. Continuous integration ensures up-to-date code. GitHub is vital to my success as a developer.' },
    { title: 'Open Source Contributor', order: 2, desc: "Open Source is the future. I usually take some time on weekend and contribute into opensource project. It gives me opportunity to learn from best developer's practices and also gives me a chance to help others and contribute into the community for the good." },
]);
console.log('✅ Expertise seeded');

// ── Projects ──────────────────────────────────────────────
await Project.insertMany([
    { order: 0, projectName: 'BD Wedding Management System', url: '', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBl_JxmPtw3Kc8XbANWbVhUjBGa1D-AQqovw&s', projectDetail: 'A BD Wedding Management System is a digital platform that streamlines wedding planning in Bangladesh. It manages bookings, vendors, budgets, guest lists, and event schedules in one place, ensuring smooth coordination and a stress-free experience for couples and planners.', technologiesUsed: [{ tech: 'ReactJS(Next.js)' }, { tech: 'Tailwind CSS' }, { tech: 'MUI' }, { tech: 'Node.js' }, { tech: 'Express.js' }, { tech: 'MongoDB with Mongoose' }, { tech: 'JWT' }, { tech: 'Passport' }, { tech: 'Nodemailer' }, { tech: 'Multer' }] },
    { order: 1, projectName: 'Donate Blood Save Life app', url: '', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGka_smTDqXVy6bDK_xSWMFDhRfUCKCyFnIg&s', projectDetail: 'A Blood Bank Management System is a digital platform that manages the collection, storage, and distribution of blood. It helps track donors, blood types, inventory levels, and requests, ensuring timely availability for patients and efficient coordination between donors, hospitals, and blood banks.', technologiesUsed: [{ tech: 'Java' }, { tech: 'Java Swing' }, { tech: 'MySQL' }] },
    { order: 2, projectName: 'Event management system', url: '', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSny3zNwQA6-rFEGJDqRHzDPr8Uo91CTtRecA&s', projectDetail: 'An Event Management System is a digital solution that helps plan, organize, and manage events efficiently. It handles tasks like scheduling, venue booking, vendor coordination, ticketing, budgeting, and attendee management, ensuring smooth execution and better communication between organizers and participants.', technologiesUsed: [{ tech: 'HTML' }, { tech: 'CSS' }, { tech: 'JavaScript' }] },
    { order: 3, projectName: 'E-Learning Management System (LMS)', url: '', image: 'https://updategadh.com/wp-content/uploads/2024/06/website-AdminDashboard.png', projectDetail: 'An E-Learning Management System (LMS) is a digital platform for delivering, tracking, and managing online education. It enables course creation, content sharing, assessments, progress tracking, and communication between instructors and learners, making learning accessible anytime and anywhere.', technologiesUsed: [{ tech: 'PHP' }, { tech: 'MySQL' }] },
]);
console.log('✅ Projects seeded');

// ── Background ────────────────────────────────────────────
await Background.create({
    eduCards: [
        { title: 'North East University Bangladesh', degree: 'CSE, Computer Engineering', detail: "Bachelor's Degree in Computer System Engineering from North East University Bangladesh.", year: '2022-2026', order: 0 },
        { title: 'Govt. MC Academy and College', degree: 'HSC, Science', detail: 'Completed HSC from Govt. MC Academy and College.', year: '2019-2021', order: 1 },
        { title: 'Baraya High School', degree: 'SSC, Science', detail: 'Completed SSC in Science subjects from Baraya High School.', year: '2017-2018', order: 2 },
    ],
    expCards: [
        { title: 'North East University Bangladesh', role: 'Undergraduate Student', url: 'https://neub.edu.bd/', desc: "Currently pursuing a Bachelor's Degree in Computer Engineering.", year: '2022 - Present', location: 'Sylhet, Bangladesh', order: 0 },
    ],
});
console.log('✅ Background seeded');

// ── Skills ────────────────────────────────────────────────
await Skill.insertMany([
    { title: 'MERN Stack Developer', level: '75%', order: 0 },
    { title: 'React Developer', level: '91%', order: 1 },
    { title: 'Backend Developer', level: '54%', order: 2 },
    { title: 'Technical Blogger', level: '83%', order: 3 },
]);
console.log('✅ Skills seeded');

// ── Meta (profile, techStack, currently, funStats, availability) ──
await Meta.insertMany([
    {
        key: 'profile',
        value: {
            name: 'Md.Istiak Hussain Adil.',
            designation: 'MERN Stack Developer',
            bio: 'Passionate MERN Stack Developer from Bangladesh, building scalable web applications.',
            photo: '/images/ADIL.jpg',
            residence: 'Bangladesh',
            city: 'Sylhet',
            age: '23',
            email: 'istiakadil346@gmail.com',
            phone: '+8801704080389',
            github: 'https://github.com/IstiakAdil14',
            linkedin: 'https://www.linkedin.com/in/istiak-adil-755361329/',
            twitter: 'https://x.com/istiakadil',
            facebook: 'https://www.facebook.com/istiak.adil.2024/',
            resumeUrl: '/DocAdilNEW.pdf',
            fiverrUrl: 'https://www.fiverr.com/s/yv1AB85',
        },
    },
    {
        key: 'techStack',
        value: ['JavaScript', 'ReactJS', 'NextJS', 'TypeScript', 'NodeJS', 'CSS', 'TailwindCSS', 'Material UI', 'Next UI', 'MongoDB', 'MySQL', 'Git', 'GitHub'],
    },
    {
        key: 'currently',
        value: { building: 'MERN Stack Portfolio', learning: 'Docker & DevOps', listening: 'Lo-fi Beats' },
    },
    {
        key: 'funstats',
        value: { coffee: 847, bugs: 2341, linesOfCode: 10, daysCoding: 365 },
    },
    {
        key: 'availability',
        value: true,
    },
]);
console.log('✅ Meta seeded (profile, techStack, currently, funstats, availability)');

await mongoose.disconnect();
console.log('\n🎉 All data seeded successfully!');
process.exit(0);
