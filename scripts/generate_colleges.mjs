import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const FILE = path.join(ROOT, 'src', 'data', 'colleges.js');

// Read original file from git HEAD (clean state, no generated photo lines)
const orig = execSync('git show HEAD:src/data/colleges.js', { cwd: ROOT }).toString().replace(/\r/g, '').replace(/\n$/, '');

const photos = {
  'rvce':'/images/colleges/rvce/photo.jpg',
  'pesu':'/images/colleges/pesu/photo.png',
  'msrit':'/images/colleges/msrit/photo.jpg',
  'bmsce':'/images/colleges/bmsce/photo.webp',
  'dsce':'/images/colleges/dsce/photo.jpg',
  'nmit':'/images/colleges/nmit/photo.webp',
  'christ-bba':'/images/colleges/christ-bba/photo.png',
  'jain-bba':'/images/colleges/jain-bba/photo.jpg',
  'mcc-bba':'/images/colleges/mcc-bba/photo.jpg',
  'sju-bba':'/images/colleges/sju-bba/photo.webp',
  'kjc-bba':'/images/colleges/kjc-bba/photo.webp',
  'christ-bcom':'/images/colleges/christ-bba/photo.png',
  'sju-bcom':'/images/colleges/sju-bba/photo.webp',
  'mcc-bcom':'/images/colleges/mcc-bba/photo.jpg',
  'jain-bcom':'/images/colleges/jain-bba/photo.jpg',
  'kjc-bcom':'/images/colleges/kjc-bba/photo.webp'
};

const lines = orig.split('\n');
let result = [];

for (let i = 0; i < lines.length; i++) {
  result.push(lines[i]);
  const idMatch = lines[i].match(/^\s*id:\s*'([^']+)'/);
  if (idMatch && photos[idMatch[1]]) {
    result.push(`    photo: '${photos[idMatch[1]]}',`);
  }
}

const sections = [
  {
    comment: '// MBA / PGDM (from PaGaLGuY)',
    entries: ['iimb','dms-iisc','xime','alliance-mba','welingkar','ibs-bangalore','nmims-bangalore','isbr','ibmt','ipl','iba','rims','msrim','isbm','dsbs','vift','iipm','ibrr-ibs','vbs','mba-esg','bims','acharya-school','aims-business','siet-sim','symbiosis-siub','reva-university','iiem','tjims','acharya-aims','amity-global-bschool']
  },
  {
    comment: '// Design',
    entries: ['nid-bangalore']
  },
  {
    comment: '// Healthcare / Yoga',
    entries: ['s-vyasa']
  },
  {
    comment: '// Statistics',
    entries: ['isibc']
  },
  {
    comment: '// Additional Institutions',
    entries: ['iiitb','amrita-engineering','cambridge-institute','iisc','indian-academy','surana-college']
  }
];

const entryData = {};
const allEntries = [
  {
    id:'iimb',name:'IIM Bangalore — Indian Institute of Management',shortName:'IIM Bangalore',category:'MBA',fees:'\u20B924.50 Lakhs',feeValue:2450000,admissionMode:'CAT',averagePackage:'\u20B930+ LPA',highestPackage:'\u20B980+ LPA',avgPkgValue:3000000,highestPkgValue:8000000,nirfRank:'1',naacGrade:'A+',overview:'IIM Bangalore is one of the premier management institutes in India, consistently ranked among the top B-schools in Asia.',coursesOffered:['MBA','MBA (Executive)','PGP in Management'],eligibility:"Bachelor's degree with CAT scores.",placementPercentage:'100%',topRecruiters:['McKinsey','BCG','Bain','Amazon','Google'],hostelFees:'\u20B92.5 Lakhs/year',roi:'High',facilities:['Library','Hostel','Sports Complex','Labs','Cafeteria','Wi-Fi Campus'],pros:['Top-ranked B-school','Excellent placements','World-class faculty'],cons:['Highly competitive admissions','High fees'],reviews:[{user:'Amit K.',rating:5,comment:'Life-changing experience. The campus and peer group are unmatched.'}],website:'https://www.pagalguy.com/colleges/indian-institute-of-management-iim-bangalore'
  },
  {
    id:'dms-iisc',name:'Indian Institute of Science, Dept. of Management Studies (DMS IISc)',shortName:'DMS IISc',category:'MBA',fees:'\u20B93.18 Lakhs',feeValue:318000,admissionMode:'GATE',averagePackage:'\u20B918\u201322 LPA',highestPackage:'\u20B950+ LPA',avgPkgValue:2000000,highestPkgValue:5000000,nirfRank:null,naacGrade:null,overview:"DMS IISc offers a highly acclaimed Master of Management Studies (MMS) program at one of India's premier research institutes.",coursesOffered:['MMS (Master of Management Studies)'],eligibility:"Bachelor's degree with GATE scores.",placementPercentage:'95%',topRecruiters:['Amazon','Microsoft','Goldman Sachs','Deloitte','BCG'],hostelFees:'\u20B90.5 Lakhs/year',roi:'High',facilities:['Library','Hostel','Research Labs','Sports Complex','Cafeteria'],pros:['IISc brand value','Low fees','Excellent ROI'],cons:['Limited batch size','Only one management program'],reviews:[{user:'Arjun S.',rating:5,comment:'Best ROI for management education in India.'}],website:'https://www.pagalguy.com/colleges/indian-institute-of-science-dept-of-management-studies-dms-iisc-bangalore'
  },
  {
    id:'xime',name:'Xavier Institute of Management & Entrepreneurship, Bangalore',shortName:'XIME',category:'MBA',fees:'\u20B912\u201315 Lakhs',feeValue:1350000,admissionMode:'CAT / XAT / CMAT / MAT',averagePackage:'\u20B98\u201311 LPA',highestPackage:'\u20B925+ LPA',avgPkgValue:950000,highestPkgValue:2500000,nirfRank:null,naacGrade:'A',overview:"XIME is one of South India's leading B-schools, known for its strong industry connections and entrepreneurial focus.",coursesOffered:['PGDM','PGDM (IB)'],eligibility:"Bachelor's degree with CAT/XAT scores.",placementPercentage:'90%',topRecruiters:['Deloitte','KPMG','HSBC','ICICI Bank',"Byju's"],hostelFees:'\u20B91 Lakh/year',roi:'Medium',facilities:['Library','Hostel','Sports','Labs','Cafeteria','Wi-Fi Campus'],pros:['Industry exposure','Entrepreneurship focus','South India brand'],cons:['Not among top 20 B-schools','High competition'],reviews:[],website:'https://www.pagalguy.com/colleges/xavier-institute-of-management-and-entrepreneurship-xime-bangalore'
  },
  {
    id:'alliance-mba',name:'Alliance University, Bangalore',shortName:'Alliance',category:'MBA',fees:'\u20B911\u201315 Lakhs',feeValue:1300000,admissionMode:'Alliance AMAT / CAT / MAT / GMAT',averagePackage:'\u20B97\u201310 LPA',highestPackage:'\u20B925+ LPA',avgPkgValue:850000,highestPkgValue:2500000,nirfRank:null,naacGrade:'A+',overview:'Alliance University is a private university known for its strong corporate connections and industry-focused MBA program.',coursesOffered:['MBA','MBA (Executive)'],eligibility:"Bachelor's degree with Alliance AMAT or CAT/MAT/GMAT scores.",placementPercentage:'85%',topRecruiters:['Amazon','Deloitte','ICICI Bank','Cognizant','Wipro'],hostelFees:'\u20B91.5 Lakhs/year',roi:'Medium',facilities:['Library','Hostel','Gym','Labs','Cafeteria','Sports Complex'],pros:['NAAC A+','Industry exposure','Good campus'],cons:['High fees','Average placement packages'],reviews:[],website:'https://www.pagalguy.com/colleges/alliance-university-bangalore'
  },
  {
    id:'welingkar',name:'Prin. L.N. Welingkar Institute of Management Development (WeSchool), Bangalore',shortName:'WeSchool',category:'MBA',fees:'\u20B910\u201313 Lakhs',feeValue:1150000,admissionMode:'CAT / XAT / CMAT / GMAT / ATMA',averagePackage:'\u20B98\u201310 LPA',highestPackage:'\u20B922+ LPA',avgPkgValue:900000,highestPkgValue:2200000,nirfRank:null,naacGrade:'A',overview:'WeSchool Bangalore campus offers innovative management programs designed to create future business leaders.',coursesOffered:['PGDM','PGDM (Business Design)','PGDM (E-Business)'],eligibility:"Bachelor's degree with CAT/XAT/CMAT scores.",placementPercentage:'88%',topRecruiters:['Deloitte','KPMG','Amazon','ICICI Bank','HDFC Bank'],hostelFees:'\u20B91.2 Lakhs/year',roi:'Medium',facilities:['Library','Hostel','Design Lab','Labs','Cafeteria'],pros:['Innovative curriculum','Design thinking focus'],cons:['Bangalore campus newer than Mumbai','Average fees'],reviews:[],website:'https://www.pagalguy.com/colleges/prin-l-n-welingkar-institute-of-management-development-weschool-bangalore'
  },
  {
    id:'ibs-bangalore',name:'ICFAI Business School (IBS), Bangalore',shortName:'IBS',category:'MBA',fees:'\u20B97\u201310 Lakhs',feeValue:850000,admissionMode:'IBSAT / CAT / GMAT',averagePackage:'\u20B96\u20138 LPA',highestPackage:'\u20B918+ LPA',avgPkgValue:700000,highestPkgValue:1800000,nirfRank:null,naacGrade:'A',overview:'IBS Bangalore is part of the ICFAI group, offering case-study-based MBA programs across India.',coursesOffered:['MBA','MBA (Executive)'],eligibility:"Bachelor's degree with IBSAT/CAT/GMAT scores.",placementPercentage:'80%',topRecruiters:['Cognizant','ICICI Bank','HDFC','Deloitte','Wipro'],hostelFees:'\u20B91 Lakh/year',roi:'Medium',facilities:['Library','Hostel','Auditorium','Labs','Cafeteria'],pros:['Pan-India presence','Case-study methodology'],cons:['Average placement packages','High fee for ROI'],reviews:[],website:'https://www.pagalguy.com/colleges/icfai-business-school-ibs-bangalore'
  },
  {
    id:'nmims-bangalore',name:'NMIMS University, Bangalore',shortName:'NMIMS',category:'MBA',fees:'\u20B916\u201318 Lakhs',feeValue:1700000,admissionMode:'NMAT / CAT',averagePackage:'\u20B98\u201312 LPA',highestPackage:'\u20B922+ LPA',avgPkgValue:1000000,highestPkgValue:2200000,nirfRank:'20',naacGrade:'A+',overview:"NMIMS Bangalore is a constituent campus of the reputed SVKM's NMIMS Deemed-to-be University.",coursesOffered:['MBA','MBA (Executive)','MBA (Pharmaceuticals)'],eligibility:"Bachelor's degree with NMAT/CAT scores.",placementPercentage:'85%',topRecruiters:['Deloitte','KPMG','Amazon','ICICI Bank','Cognizant'],hostelFees:'\u20B91.5 Lakhs/year',roi:'Medium',facilities:['Library','Hostel','Labs','Sports','Cafeteria'],pros:['NMIMS brand','Multiple specializations','Mumbai campus transfer option'],cons:['High fees','Bangalore campus smaller than Mumbai'],reviews:[],website:'https://www.pagalguy.com/colleges/nmims-university-bangalore'
  },
  {
    id:'isbr',name:'International School of Business & Research (ISBR), Bangalore',shortName:'ISBR',category:'MBA',fees:'\u20B98\u201310 Lakhs',feeValue:900000,admissionMode:'CAT / MAT / GMAT / CMAT',averagePackage:'\u20B96\u20138 LPA',highestPackage:'\u20B915+ LPA',avgPkgValue:700000,highestPkgValue:1500000,nirfRank:null,naacGrade:null,overview:'ISBR Bangalore offers industry-integrated MBA programs with emphasis on research and practical learning.',coursesOffered:['MBA','PGDM'],eligibility:"Bachelor's degree with CAT/MAT scores.",placementPercentage:'80%',topRecruiters:['Infosys','Wipro','Cognizant','ICICI Bank'],hostelFees:'\u20B90.8 Lakhs/year',roi:'Medium',facilities:['Library','Hostel','Labs','Cafeteria'],pros:['Industry tie-ups','Reasonable fees'],cons:['Less brand recognition','Average placements'],reviews:[],website:'https://www.pagalguy.com/colleges/international-school-of-business-and-research-isbr-bangalore'
  },
  {
    id:'ibmt',name:'Institute of Business Management & Technology (IBMT), Bangalore',shortName:'IBMT',category:'MBA',fees:'\u20B96.5\u20138 Lakhs',feeValue:700000,admissionMode:'CAT / MAT / CMAT',averagePackage:'\u20B95\u20137 LPA',highestPackage:'\u20B912+ LPA',avgPkgValue:600000,highestPkgValue:1200000,nirfRank:null,naacGrade:null,overview:'IBMT is a management institute offering affordable MBA programs with focus on holistic development.',coursesOffered:['MBA','PGDM'],eligibility:"Bachelor's degree with CAT/MAT scores.",placementPercentage:'70%',topRecruiters:['Infosys','Wipro','Cognizant','TCS'],hostelFees:'\u20B90.6 Lakhs/year',roi:'Medium',facilities:['Library','Hostel','Labs','Cafeteria'],pros:['Affordable fees','Flexible programs'],cons:['Limited placements','Less industry exposure'],reviews:[],website:'https://www.pagalguy.com/colleges/institute-of-business-management-and-technology-ibmt-bangalore'
  },
  {
    id:'ipl',name:'Institute of Product Leadership (IPL), Bangalore',shortName:'IPL',category:'MBA',fees:'\u20B910\u201312 Lakhs',feeValue:1100000,admissionMode:'CAT / GMAT / Work Experience',averagePackage:'\u20B912\u201316 LPA',highestPackage:'\u20B930+ LPA',avgPkgValue:1400000,highestPkgValue:3000000,nirfRank:null,naacGrade:null,overview:'IPL offers specialized MBA programs in product management, catering to the growing demand for product leaders in tech.',coursesOffered:['MBA in Product Management'],eligibility:"Bachelor's degree with work experience preferred.",placementPercentage:'90%',topRecruiters:['Google','Microsoft','Amazon','Flipkart','Swiggy'],hostelFees:'\u20B91 Lakh/year',roi:'High',facilities:['Library','Co-working Spaces','Labs','Cafeteria'],pros:['Niche product management focus','Strong placement record','Industry mentors'],cons:['Niche specialization','Requires work experience'],reviews:[],website:'https://www.pagalguy.com/colleges/institute-of-product-leadership-ipl-bangalore'
  },
  {
    id:'iba',name:'Indus Business Academy (IBA), Bangalore',shortName:'IBA',category:'MBA',fees:'\u20B910.83 Lakhs',feeValue:1083000,admissionMode:'CAT / MAT / XAT / CMAT',averagePackage:'\u20B97\u20139 LPA',highestPackage:'\u20B920+ LPA',avgPkgValue:800000,highestPkgValue:2000000,nirfRank:null,naacGrade:'A',overview:'IBA Bangalore is known for its value-based management education and focus on ethical leadership.',coursesOffered:['PGDM','MBA'],eligibility:"Bachelor's degree with CAT/MAT/XAT scores.",placementPercentage:'85%',topRecruiters:['Deloitte','KPMG','ICICI Bank','HDFC Bank','Cognizant'],hostelFees:'\u20B91 Lakh/year',roi:'Medium',facilities:['Library','Hostel','Sports','Labs','Cafeteria'],pros:['Strong alumni network','Ethical leadership focus'],cons:['Not ranked among top B-schools'],reviews:[],website:'https://www.pagalguy.com/colleges/indus-business-academy-iba-bangalore'
  },
  {
    id:'rims',name:'Ramaiah Institute of Management Studies & Science (RIMS), Bangalore',shortName:'RIMS',category:'MBA',fees:'\u20B96.25 Lakhs',feeValue:625000,admissionMode:'CAT / MAT / CMAT',averagePackage:'\u20B95\u20137 LPA',highestPackage:'\u20B915+ LPA',avgPkgValue:600000,highestPkgValue:1500000,nirfRank:null,naacGrade:null,overview:'RIMS is part of the Ramaiah Group and offers affordable management education in Bangalore.',coursesOffered:['MBA'],eligibility:"Bachelor's degree with CAT/MAT scores.",placementPercentage:'75%',topRecruiters:['Infosys','Wipro','Cognizant','HDFC Bank'],hostelFees:'\u20B90.7 Lakhs/year',roi:'Medium',facilities:['Library','Hostel','Labs','Cafeteria'],pros:['Affordable','Ramaiah brand','Good location'],cons:['Average placements'],reviews:[],website:'https://www.pagalguy.com/colleges/ramaiah-institute-of-management-studies-and-science-rims-bangalore'
  },
  {
    id:'msrim',name:'M.S. Ramaiah Institute of Management (MSRIM), Bangalore',shortName:'MSRIM',category:'MBA',fees:'\u20B96 Lakhs',feeValue:600000,admissionMode:'CAT / MAT / CMAT',averagePackage:'\u20B95\u20137 LPA',highestPackage:'\u20B912+ LPA',avgPkgValue:600000,highestPkgValue:1200000,nirfRank:null,naacGrade:null,overview:'MSRIM is one of the older management institutes in Bangalore, offering both PGDM and MBA programs.',coursesOffered:['PGDM','MBA'],eligibility:"Bachelor's degree with CAT/MAT scores.",placementPercentage:'70%',topRecruiters:['TCS','Infosys','Wipro','Cognizant'],hostelFees:'\u20B90.7 Lakhs/year',roi:'Medium',facilities:['Library','Hostel','Sports','Labs','Cafeteria'],pros:['Legacy institution','Affordable fees'],cons:['Average placement packages','Old infrastructure'],reviews:[],website:'https://www.pagalguy.com/colleges/m-s-ramaiah-institute-of-management-msrim-bangalore'
  },
  {
    id:'isbm',name:'Indian School of Business Management & Administration (ISBM), Bangalore',shortName:'ISBM',category:'MBA',fees:'\u20B95\u20138 Lakhs',feeValue:650000,admissionMode:'Direct / MAT / CMAT',averagePackage:'\u20B94\u20136 LPA',highestPackage:'\u20B910+ LPA',avgPkgValue:500000,highestPkgValue:1000000,nirfRank:null,naacGrade:null,overview:'ISBM offers flexible management programs designed for working professionals and fresh graduates.',coursesOffered:['MBA','PGDM (Executive)'],eligibility:"Bachelor's degree.",placementPercentage:'60%',topRecruiters:['Infosys','Wipro','TCS','Cognizant'],hostelFees:'\u20B90.5 Lakhs/year',roi:'Low',facilities:['Library','Hostel','Labs','Cafeteria'],pros:['Affordable fees','Flexible programs'],cons:['Low brand value','Limited placements'],reviews:[],website:'https://www.pagalguy.com/colleges/indian-school-of-business-management-and-administration-isbm-bangalore'
  },
  {
    id:'dsbs',name:'Dayananda Sagar Business School (DSBS), Bangalore',shortName:'DSBS',category:'MBA',fees:'\u20B96 Lakhs',feeValue:600000,admissionMode:'CAT / MAT / CMAT',averagePackage:'\u20B95\u20138 LPA',highestPackage:'\u20B915+ LPA',avgPkgValue:650000,highestPkgValue:1500000,nirfRank:null,naacGrade:null,overview:'DSBS is part of the Dayananda Sagar Group, one of the largest educational groups in Bangalore.',coursesOffered:['PGDM'],eligibility:"Bachelor's degree with CAT/MAT scores.",placementPercentage:'75%',topRecruiters:['Infosys','Wipro','Cognizant','HDFC Bank'],hostelFees:'\u20B91 Lakh/year',roi:'Medium',facilities:['Library','Hostel','Sports','Labs','Cafeteria'],pros:['Part of large educational group','Good infrastructure'],cons:['Average placement packages'],reviews:[],website:'https://www.pagalguy.com/colleges/dayananda-sagar-business-school-dsbs-bangalore'
  },
  {
    id:'vift',name:'Vogue Institute of Fashion Technology (VIFT), Bangalore',shortName:'VIFT',category:'MBA',fees:'\u20B96.95 Lakhs',feeValue:695000,admissionMode:'Direct / CAT / CMAT',averagePackage:'\u20B94\u20136 LPA',highestPackage:'\u20B910+ LPA',avgPkgValue:500000,highestPkgValue:1000000,nirfRank:null,naacGrade:null,overview:"VIFT is Bangalore's premier fashion management institute, offering niche programs in fashion business.",coursesOffered:['PGDM (Fashion Mgmt)','PGDM (Retail Mgmt)'],eligibility:"Bachelor's degree.",placementPercentage:'70%',topRecruiters:['Pantaloons','Shoppers Stop','Myntra','Jack & Jones'],hostelFees:'\u20B90.8 Lakhs/year',roi:'Low',facilities:['Library','Hostel','Design Studio','Labs','Cafeteria'],pros:['Niche fashion programs','Industry connections'],cons:['Narrow specialization','Low overall placements'],reviews:[],website:'https://www.pagalguy.com/colleges/vogue-institute-of-fashion-technology-vift-bangalore'
  },
  {
    id:'iipm',name:'Indian Institute of Plantation Management (IIPM), Bangalore',shortName:'IIPM',category:'MBA',fees:'\u20B94.82 Lakhs',feeValue:482000,admissionMode:'CAT / MAT / CMAT / XAT',averagePackage:'\u20B96\u20139 LPA',highestPackage:'\u20B920+ LPA',avgPkgValue:750000,highestPkgValue:2000000,nirfRank:null,naacGrade:null,overview:'IIPM Bangalore is a premier institute offering specialized management education for the plantation and agribusiness sectors.',coursesOffered:['MBA (ABPM)','MBA (Executive)'],eligibility:"Bachelor's degree with CAT/MAT scores.",placementPercentage:'85%',topRecruiters:['Tata Tea','ITC','MTR Foods','Nestle','Britannia'],hostelFees:'\u20B90.6 Lakhs/year',roi:'High',facilities:['Library','Hostel','Research Center','Labs','Cafeteria'],pros:['Niche specialization','Very low fees','Good placements in sector'],cons:['Only plantation/agribusiness focus','Niche job market'],reviews:[],website:'https://www.pagalguy.com/colleges/indian-institute-of-plantation-management-iipm-bangalore'
  },
  {
    id:'ibrr-ibs',name:'Institute of Business Management & Research (IBMR-IBS), Bangalore',shortName:'IBMR-IBS',category:'MBA',fees:'\u20B92.5 Lakhs',feeValue:250000,admissionMode:'Direct / MAT / CMAT',averagePackage:'\u20B94\u20136 LPA',highestPackage:'\u20B910+ LPA',avgPkgValue:500000,highestPkgValue:1000000,nirfRank:null,naacGrade:null,overview:'IBMR-IBS offers budget-friendly management education with a focus on research-oriented learning.',coursesOffered:['MBA','PGDM'],eligibility:"Bachelor's degree.",placementPercentage:'60%',topRecruiters:['Infosys','Wipro','TCS','Cognizant'],hostelFees:'\u20B90.5 Lakhs/year',roi:'Low',facilities:['Library','Hostel','Labs','Cafeteria'],pros:['Budget-friendly fees'],cons:['Limited placements','Low brand recognition'],reviews:[],website:'https://www.pagalguy.com/colleges/ibmr-bangalore'
  },
  {
    id:'vbs',name:'Vanguard Business School (VBS), Bangalore',shortName:'VBS',category:'MBA',fees:'\u20B95.75 Lakhs',feeValue:575000,admissionMode:'CAT / MAT / CMAT / Direct',averagePackage:'\u20B95\u20137 LPA',highestPackage:'\u20B912+ LPA',avgPkgValue:600000,highestPkgValue:1200000,nirfRank:null,naacGrade:null,overview:'VBS offers industry-oriented PGPM programs with emphasis on practical learning and corporate exposure.',coursesOffered:['PGPM'],eligibility:"Bachelor's degree with CAT/MAT scores.",placementPercentage:'75%',topRecruiters:['Infosys','Cognizant','HDFC Bank','ICICI Bank'],hostelFees:'\u20B90.8 Lakhs/year',roi:'Medium',facilities:['Library','Hostel','Labs','Cafeteria'],pros:['Industry-oriented curriculum','Reasonable fees'],cons:['Low brand awareness'],reviews:[],website:'https://www.pagalguy.com/colleges/vanguard-business-school-vbs-bangalore'
  },
  {
    id:'mba-esg',name:'MBA ESG India, Bangalore',shortName:'MBA ESG',category:'MBA',fees:'\u20B99.95 Lakhs',feeValue:995000,admissionMode:'CAT / MAT / Direct',averagePackage:'\u20B97\u201310 LPA',highestPackage:'\u20B920+ LPA',avgPkgValue:850000,highestPkgValue:2000000,nirfRank:null,naacGrade:null,overview:'MBA ESG offers specialized sports management programs alongside traditional MBA specializations.',coursesOffered:['MBA (Sports Mgmt)','MBA (Finance)','MBA (Marketing)'],eligibility:"Bachelor's degree with CAT/MAT scores.",placementPercentage:'80%',topRecruiters:['Decathlon','Nike','Adidas','Stadium Management'],hostelFees:'\u20B91 Lakh/year',roi:'Medium',facilities:['Library','Hostel','Sports Facilities','Labs','Cafeteria'],pros:['Niche sports management','International collaborations'],cons:['French curriculum may not suit all','High fees'],reviews:[],website:'https://www.pagalguy.com/colleges/mba-esg-india-bangalore'
  },
  {
    id:'bims',name:'Bangalore Institute of Management Studies (BIMS), Bangalore',shortName:'BIMS',category:'MBA',fees:'\u20B95\u20138 Lakhs',feeValue:650000,admissionMode:'CAT / MAT / CMAT',averagePackage:'\u20B94\u20136 LPA',highestPackage:'\u20B910+ LPA',avgPkgValue:500000,highestPkgValue:1000000,nirfRank:null,naacGrade:null,overview:'BIMS offers affordable management education in the heart of Bangalore with focus on holistic development.',coursesOffered:['MBA'],eligibility:"Bachelor's degree with CAT/MAT scores.",placementPercentage:'65%',topRecruiters:['Infosys','Wipro','TCS','Cognizant'],hostelFees:'\u20B90.6 Lakhs/year',roi:'Low',facilities:['Library','Hostel','Labs','Cafeteria'],pros:['Affordable fees','Central location'],cons:['Limited placements','Less industry exposure'],reviews:[],website:'https://www.pagalguy.com/colleges/bangalore-institute-of-management-studies-bims-bangalore'
  },
  {
    id:'acharya-school',name:'Acharya School of Management (ASM), Bangalore',shortName:'ASM',category:'MBA',fees:'\u20B96\u20139 Lakhs',feeValue:750000,admissionMode:'CAT / MAT / CMAT',averagePackage:'\u20B95\u20137 LPA',highestPackage:'\u20B915+ LPA',avgPkgValue:600000,highestPkgValue:1500000,nirfRank:null,naacGrade:'A',overview:'ASM is part of the Acharya Group, a premier educational group offering management programs with industry focus.',coursesOffered:['MBA'],eligibility:"Bachelor's degree with CAT/MAT scores.",placementPercentage:'75%',topRecruiters:['Infosys','Wipro','Cognizant','ICICI Bank'],hostelFees:'\u20B91 Lakh/year',roi:'Medium',facilities:['Library','Hostel','Sports','Labs','Cafeteria'],pros:['Part of large educational group','Good infrastructure'],cons:['Average placement packages'],reviews:[],website:'https://www.pagalguy.com/colleges/acharya-school-of-management-asm-bangalore'
  },
  {
    id:'aims-business',name:'AIMS School of Business, Bangalore',shortName:'AIMS',category:'MBA',fees:'\u20B96\u20139 Lakhs',feeValue:750000,admissionMode:'CAT / MAT / CMAT',averagePackage:'\u20B95\u20137 LPA',highestPackage:'\u20B912+ LPA',avgPkgValue:600000,highestPkgValue:1200000,nirfRank:null,naacGrade:null,overview:'AIMS School of Business is a part of the Acharya Institute of Management and Sciences group.',coursesOffered:['MBA','PGDM'],eligibility:"Bachelor's degree with CAT/MAT scores.",placementPercentage:'70%',topRecruiters:['Infosys','Cognizant','Wipro','TCS'],hostelFees:'\u20B90.8 Lakhs/year',roi:'Low',facilities:['Library','Hostel','Labs','Cafeteria'],pros:['Part of established group'],cons:['Low brand recognition','Average placements'],reviews:[],website:'https://www.pagalguy.com/colleges/aims-school-of-business-bangalore'
  },
  {
    id:'siet-sim',name:'SIET Institute of Management (SIM), Bangalore',shortName:'SIM',category:'MBA',fees:'\u20B95\u20138 Lakhs',feeValue:650000,admissionMode:'Direct / CAT / MAT',averagePackage:'\u20B94\u20136 LPA',highestPackage:'\u20B910+ LPA',avgPkgValue:500000,highestPkgValue:1000000,nirfRank:null,naacGrade:null,overview:'SIET Institute of Management provides quality management education at an affordable cost.',coursesOffered:['PGPM'],eligibility:"Bachelor's degree.",placementPercentage:'60%',topRecruiters:['Infosys','Wipro','TCS','Cognizant'],hostelFees:'\u20B90.5 Lakhs/year',roi:'Low',facilities:['Library','Hostel','Labs','Cafeteria'],pros:['Low fees'],cons:['Limited placements','Low brand value'],reviews:[],website:'https://www.pagalguy.com/colleges/siet-institute-of-management-sim-bangalore'
  },
  {
    id:'symbiosis-siub',name:'Symbiosis International University (SIUB), Bangalore',shortName:'SIUB',category:'MBA',fees:'\u20B91.31 Lakhs',feeValue:131000,admissionMode:'Symbiosis Entrance Test',averagePackage:'\u20B96\u20139 LPA',highestPackage:'\u20B920+ LPA',avgPkgValue:750000,highestPkgValue:2000000,nirfRank:null,naacGrade:'A',overview:'Symbiosis Bangalore campus offers specialized programs under the renowned Symbiosis International University.',coursesOffered:['PGP Operations Mgmt'],eligibility:"Bachelor's degree with Symbiosis Entrance Test scores.",placementPercentage:'80%',topRecruiters:['Amazon','Deloitte','HSBC','Infosys','Wipro'],hostelFees:'\u20B91 Lakh/year',roi:'High',facilities:['Library','Hostel','Sports','Labs','Cafeteria'],pros:['Symbiosis brand','Very low fees for some programs','Good ROI'],cons:['Limited program offerings in Bangalore','Smaller campus'],reviews:[],website:'https://www.pagalguy.com/colleges/symbiosis-international-university-siub-bangalore'
  },
  {
    id:'reva-university',name:'REVA University, Bangalore',shortName:'REVA',category:'MBA',fees:'\u20B97\u201311 Lakhs',feeValue:900000,admissionMode:'REVA Entrance / CAT / MAT',averagePackage:'\u20B96\u20139 LPA',highestPackage:'\u20B920+ LPA',avgPkgValue:750000,highestPkgValue:2000000,nirfRank:'100+',naacGrade:'A+',overview:'REVA University offers comprehensive MBA programs across multiple specializations with good placement support.',coursesOffered:['MBA (Finance, Marketing, HR, Analytics)'],eligibility:"Bachelor's degree with REVA Entrance or CAT/MAT scores.",placementPercentage:'80%',topRecruiters:['Amazon','Deloitte','ICICI Bank','Infosys','Wipro'],hostelFees:'\u20B91 Lakh/year',roi:'Medium',facilities:['Library','Hostel','Sports Complex','Labs','Cafeteria','Wi-Fi Campus'],pros:['NAAC A+','Large campus','Multiple specializations'],cons:['High fees','Moderate placement packages'],reviews:[],website:'https://www.pagalguy.com/colleges/reva-university-bangalore'
  },
  {
    id:'iiem',name:'Indian Institute of Export Management (IIEM), Bangalore',shortName:'IIEM',category:'MBA',fees:'\u20B93\u20136 Lakhs',feeValue:450000,admissionMode:'Direct / CAT / MAT',averagePackage:'\u20B94\u20137 LPA',highestPackage:'\u20B912+ LPA',avgPkgValue:550000,highestPkgValue:1200000,nirfRank:null,naacGrade:null,overview:'IIEM specializes in export management education, preparing students for careers in international trade.',coursesOffered:['Diploma in Export Mgmt','MBA (International Business)'],eligibility:"Bachelor's degree.",placementPercentage:'65%',topRecruiters:['Export Houses','Logistics Companies','Trade Organizations'],hostelFees:'\u20B90.5 Lakhs/year',roi:'Low',facilities:['Library','Hostel','Labs','Cafeteria'],pros:['Niche export management focus','Low fees'],cons:['Limited placement opportunities','Niche job market'],reviews:[],website:'https://www.pagalguy.com/colleges/indian-institute-of-export-management-iiem-bangalore'
  },
  {
    id:'tjims',name:'T John Institute of Management & Science (TJIMS), Bangalore',shortName:'TJIMS',category:'MBA',fees:'\u20B96\u20139 Lakhs',feeValue:750000,admissionMode:'CAT / MAT / CMAT',averagePackage:'\u20B95\u20137 LPA',highestPackage:'\u20B912+ LPA',avgPkgValue:600000,highestPkgValue:1200000,nirfRank:null,naacGrade:null,overview:'TJIMS offers management programs focused on developing entrepreneurial skills and business acumen.',coursesOffered:['MBA'],eligibility:"Bachelor's degree with CAT/MAT scores.",placementPercentage:'70%',topRecruiters:['Infosys','Wipro','Cognizant','ICICI Bank'],hostelFees:'\u20B90.8 Lakhs/year',roi:'Low',facilities:['Library','Hostel','Labs','Cafeteria'],pros:['Affordable fees'],cons:['Limited brand recognition','Average placements'],reviews:[],website:'https://www.pagalguy.com/colleges/t-john-institute-of-management-and-science-tjims-bangalore'
  },
  {
    id:'acharya-aims',name:'Acharya Institute of Management & Science (AIMS), Bangalore',shortName:'AIMS',category:'MBA',fees:'\u20B96\u20139 Lakhs',feeValue:750000,admissionMode:'CAT / MAT / CMAT',averagePackage:'\u20B95\u20137 LPA',highestPackage:'\u20B912+ LPA',avgPkgValue:600000,highestPkgValue:1200000,nirfRank:null,naacGrade:'A',overview:'AIMS is part of the Acharya Group, offering industry-relevant management programs since many years.',coursesOffered:['MBA','PGDM'],eligibility:"Bachelor's degree with CAT/MAT scores.",placementPercentage:'70%',topRecruiters:['Infosys','Cognizant','Wipro','TCS'],hostelFees:'\u20B90.8 Lakhs/year',roi:'Low',facilities:['Library','Hostel','Sports','Labs','Cafeteria'],pros:['Part of large educational group','NAAC A'],cons:['Average placements','High competition from other Acharya institutes'],reviews:[],website:'https://www.pagalguy.com/colleges/acharya-institute-of-management-and-science-aims-bangalore'
  },
  {
    id:'amity-global-bschool',name:'Amity Global Business School (AGBS), Bangalore',shortName:'AGBS Bangalore',category:'MBA',fees:'\u20B97\u201310 Lakhs',feeValue:850000,admissionMode:'Amity Entrance / CAT / MAT',averagePackage:'\u20B96\u20138 LPA',highestPackage:'\u20B918+ LPA',avgPkgValue:700000,highestPkgValue:1800000,nirfRank:null,naacGrade:null,overview:'Amity Global Business School offers MBA programs in multiple specializations at its Bangalore campus.',coursesOffered:['MBA (Finance, Marketing, HR, Operations)'],eligibility:"Bachelor's degree with Amity Entrance or CAT/MAT scores.",placementPercentage:'75%',topRecruiters:['Deloitte','KPMG','ICICI Bank','Cognizant',"Byju's"],hostelFees:'\u20B91 Lakh/year',roi:'Medium',facilities:['Library','Hostel','Smart Classrooms','Labs','Cafeteria'],pros:['Amity brand value','Industry exposure','Multiple specializations'],cons:['Average placements','High competition from other Amity campuses'],reviews:[],website:'https://www.pagalguy.com/colleges/amity-global-business-school-agbs-bangalore'
  },
  {
    id:'nid-bangalore',name:'National Institute of Design (NID), Bangalore',shortName:'NID Bangalore',category:'Design',fees:'\u20B95.77 Lakhs',feeValue:577000,admissionMode:'NID DAT',averagePackage:'\u20B98\u201312 LPA',highestPackage:'\u20B925+ LPA',avgPkgValue:1000000,highestPkgValue:2500000,nirfRank:'1',naacGrade:null,overview:"NID Bangalore is one of India's premier design institutions, offering M.Des programs in multiple design disciplines.",coursesOffered:['M.Des','B.Des'],eligibility:"Bachelor's degree with NID DAT scores.",placementPercentage:'90%',topRecruiters:['Apple','Google','Microsoft','IDEO','Titan'],hostelFees:'\u20B91 Lakh/year',roi:'High',facilities:['Library','Hostel','Design Studio','Labs','Cafeteria'],pros:['Premier design institute','Excellent placements','Creative environment'],cons:['Highly competitive entry'],reviews:[{user:'Priya S.',rating:5,comment:'Dream college for any design aspirant.'}],website:'https://www.pagalguy.com/colleges/national-institute-of-design-nid-bangalore'
  },
  {
    id:'s-vyasa',name:'Swami Vivekananda Yoga Anusandhana Samsthana (S-VYASA), Bangalore',shortName:'S-VYASA',category:'Healthcare',fees:'\u20B92\u20135 Lakhs',feeValue:350000,admissionMode:'Direct / Entrance',averagePackage:'\u20B94\u20136 LPA',highestPackage:'\u20B910+ LPA',avgPkgValue:500000,highestPkgValue:1000000,nirfRank:null,naacGrade:'A+',overview:'S-VYASA is a Deemed-to-be-University focused on yoga, health sciences, and holistic wellness education.',coursesOffered:['B.Sc (Yoga)','M.Sc (Yoga)','Ph.D (Yoga)'],eligibility:"10+2 or Bachelor's degree depending on program.",placementPercentage:'70%',topRecruiters:['Wellness Centers','Hospitals','Yoga Centers','Research Institutes'],hostelFees:'\u20B90.8 Lakhs/year',roi:'Medium',facilities:['Library','Hostel','Yoga Hall','Research Center','Cafeteria'],pros:['Unique yoga education','NAAC A+','Government recognized'],cons:['Niche field','Limited corporate placements'],reviews:[],website:'https://www.pagalguy.com/colleges/swami-vivekananda-yoga-anusandhana-samsthana-s-vyasa-bangalore'
  },
  {
    id:'isibc',name:'Indian Statistical Institute (ISIBC), Bangalore',shortName:'ISI Bangalore',category:'Science',fees:'\u20B90.5\u20132 Lakhs',feeValue:125000,admissionMode:'ISI Entrance Test',averagePackage:'\u20B912\u201318 LPA',highestPackage:'\u20B940+ LPA',avgPkgValue:1500000,highestPkgValue:4000000,nirfRank:null,naacGrade:null,overview:"ISI Bangalore is one of India's premier institutes for statistics and data science education.",coursesOffered:['B.Stat (Hons)','M.Stat','MS in Data Science'],eligibility:"10+2 or Bachelor's with ISI entrance test scores.",placementPercentage:'95%',topRecruiters:['Google','Amazon','Microsoft','Goldman Sachs','JPMC'],hostelFees:'\u20B90.3 Lakhs/year',roi:'Very High',facilities:['Library','Hostel','Computer Labs','Cafeteria'],pros:['World-class statistics education','Excellent placements','Very low fees'],cons:['Highly competitive','Very limited seats'],reviews:[{user:'Ankit M.',rating:5,comment:'ISI is a hidden gem for data science careers.'}],website:'https://www.pagalguy.com/colleges/testing-indian-statistical-institute-isibc-bangalore'
  },
  {
    id:'iiitb',name:'International Institute of Information Technology (IIIT-B), Bangalore',shortName:'IIIT-B',category:'Engineering',fees:'\u20B910\u201314 Lakhs',feeValue:1200000,admissionMode:'JEE Main / JEE Advanced',averagePackage:'\u20B920\u201330 LPA',highestPackage:'\u20B960+ LPA',avgPkgValue:2500000,highestPkgValue:6000000,nirfRank:'50',naacGrade:null,overview:'IIIT Bangalore is a premier IT-focused institute known for its research output and excellent tech placements.',coursesOffered:['B.Tech (CSE)','M.Tech','Ph.D'],eligibility:'10+2 with JEE Main/Advanced scores.',placementPercentage:'98%',topRecruiters:['Google','Microsoft','Amazon','Uber','Flipkart'],hostelFees:'\u20B91 Lakh/year',roi:'Very High',facilities:['Library','Hostel','Labs','Sports Complex','Cafeteria'],pros:['Excellent placements','Strong research','Industry connections'],cons:['Limited branches (only CSE, ECE)'],reviews:[{user:'Aarav K.',rating:5,comment:'Best for CSE after the top IITs.'}],website:'https://www.pagalguy.com/colleges/international-institute-of-information-technology-iiit-b-bangalore-2'
  },
  {
    id:'amrita-engineering',name:'Amrita School of Engineering, Bangalore',shortName:'Amrita',category:'Engineering',fees:'\u20B914\u201318 Lakhs',feeValue:1600000,admissionMode:'Amrita Entrance Exam / JEE',averagePackage:'\u20B98\u201312 LPA',highestPackage:'\u20B940+ LPA',avgPkgValue:1000000,highestPkgValue:4000000,nirfRank:'100+',naacGrade:'A+',overview:'Amrita School of Engineering is part of the Amrita Vishwa Vidyapeetham, known for its holistic education approach.',coursesOffered:['B.Tech (CSE, ECE, EEE)','M.Tech'],eligibility:'10+2 with Amrita Entrance Exam or JEE scores.',placementPercentage:'85%',topRecruiters:['Amazon','Cognizant','TCS','Infosys','Wipro'],hostelFees:'\u20B91.5 Lakhs/year',roi:'Medium',facilities:['Library','Hostel','Sports','Labs','Cafeteria'],pros:['NAAC A+','Amrita brand','Spiritual campus environment'],cons:['High fees','Relatively new Bangalore campus'],reviews:[],website:'https://www.pagalguy.com/colleges/amrita-school-of-engineering-ase-bangalore'
  },
  {
    id:'cambridge-institute',name:'Cambridge Institute of Technology (CiTech), Bangalore',shortName:'CiTech',category:'Engineering',fees:'\u20B96\u201310 Lakhs',feeValue:800000,admissionMode:'KCET / COMEDK',averagePackage:'\u20B95\u20137 LPA',highestPackage:'\u20B920+ LPA',avgPkgValue:600000,highestPkgValue:2000000,nirfRank:null,naacGrade:null,overview:'CiTech offers engineering programs with focus on practical learning and industry readiness.',coursesOffered:['B.E. (CSE, ECE, ISE, ME)','M.Tech'],eligibility:'10+2 with KCET/COMEDK scores.',placementPercentage:'75%',topRecruiters:['TCS','Cognizant','Infosys','Wipro'],hostelFees:'\u20B90.8 Lakhs/year',roi:'Medium',facilities:['Library','Hostel','Sports','Labs','Cafeteria'],pros:['Affordable','Autonomous institution'],cons:['Average placements'],reviews:[],website:'https://www.pagalguy.com/colleges/cambridge-institute-of-technology-citech-bangalore'
  },
  {
    id:'iisc',name:'Indian Institute of Science (IISc), Bangalore',shortName:'IISc',category:'Science',fees:'\u20B90.5\u20132 Lakhs',feeValue:125000,admissionMode:'JEE Advanced / GATE / IISc Entrance',averagePackage:'\u20B920\u201330 LPA',highestPackage:'\u20B980+ LPA',avgPkgValue:2500000,highestPkgValue:8000000,nirfRank:'1',naacGrade:null,overview:"IISc is India's premier research institute, consistently ranked #1 in NIRF Overall category.",coursesOffered:['B.Tech (in collaboration)','M.Tech','Ph.D','MMS (via DMS)'],eligibility:"Bachelor's degree with GATE/JEE Advanced/IISc Entrance scores.",placementPercentage:'98%',topRecruiters:['Google','Microsoft','Amazon','Goldman Sachs','BCG'],hostelFees:'\u20B90.4 Lakhs/year',roi:'Very High',facilities:['Library','Hostel','Labs','Sports Complex','Research Centers'],pros:['#1 NIRF ranked','World-class research','Excellent placements'],cons:['Very competitive entry','Limited undergraduate programs'],reviews:[{user:'Aditya R.',rating:5,comment:'The best place for research in India.'}],website:'https://www.pagalguy.com/colleges/indian-institute-of-science-iisc-bangalore'
  },
  {
    id:'indian-academy',name:'Indian Academy Group of Institutions (IAGI), Bangalore',shortName:'Indian Academy',category:'Science',fees:'\u20B93\u20138 Lakhs',feeValue:550000,admissionMode:'Direct / Entrance',averagePackage:'\u20B94\u20136 LPA',highestPackage:'\u20B915+ LPA',avgPkgValue:500000,highestPkgValue:1500000,nirfRank:null,naacGrade:null,overview:'Indian Academy Group of Institutions offers multiple programs in engineering, science, and commerce.',coursesOffered:['B.E.','B.Sc','B.Com','MBA','M.Tech'],eligibility:"10+2 or Bachelor's depending on program.",placementPercentage:'70%',topRecruiters:['TCS','Infosys','Wipro','Cognizant'],hostelFees:'\u20B90.6 Lakhs/year',roi:'Medium',facilities:['Library','Hostel','Sports','Labs','Cafeteria'],pros:['Multi-discipline options','Decent infrastructure'],cons:['Not top-ranked','Average placements'],reviews:[],website:'https://www.pagalguy.com/colleges/indian-academy-group-of-institutions-iagi-bangalore'
  },
  {
    id:'surana-college',name:'Surana College, Bangalore',shortName:'Surana College',category:'B.Com',fees:'\u20B91.5\u20133 Lakhs',feeValue:225000,admissionMode:'Direct Admission',averagePackage:'\u20B93\u20135 LPA',highestPackage:'\u20B910+ LPA',avgPkgValue:400000,highestPkgValue:1000000,nirfRank:null,naacGrade:'B+',overview:'Surana College is a well-known institution in Bangalore offering commerce and management programs.',coursesOffered:['B.Com','BBA','BBM','M.Com'],eligibility:'10+2 with commerce background.',placementPercentage:'60%',topRecruiters:['Infosys','Cognizant','HDFC Bank','ICICI Bank'],hostelFees:'\u20B90.5 Lakhs/year',roi:'Medium',facilities:['Library','Hostel','Computer Lab','Cafeteria'],pros:['Affordable fees','Central Bangalore location'],cons:['Average placements','Limited modern infrastructure'],reviews:[],website:'https://www.pagalguy.com/colleges/surana-college-bangalore'
  }
];

function esc(str) {
  return str.replace(/'/g, "\\'");
}

function genEntry(e) {
  const logo = `/images/colleges/${e.id}/photo.svg`;
  const fields = [
    `    id: '${e.id}',`,
    `    photo: '${logo}',`,
    `    name: '${esc(e.name)}',`,
    `    shortName: '${e.shortName}',`,
    `    category: '${e.category}',`,
    `    fees: '${e.fees}',`,
    `    feeValue: ${e.feeValue},`,
    `    admissionMode: '${e.admissionMode}',`,
    `    averagePackage: '${e.averagePackage}',`,
    `    highestPackage: '${e.highestPackage}',`,
    `    avgPkgValue: ${e.avgPkgValue},`,
    `    highestPkgValue: ${e.highestPkgValue},`,
    `    nirfRank: ${e.nirfRank ? `'${e.nirfRank}'` : 'null'},`,
    `    naacGrade: ${e.naacGrade ? `'${e.naacGrade}'` : 'null'},`,
    `    logo: '/images/colleges/placeholder.svg',`,
    `    gallery: [],`,
    `    overview: '${esc(e.overview)}',`,
    `    coursesOffered: ${JSON.stringify(e.coursesOffered)},`,
    `    eligibility: '${esc(e.eligibility)}',`,
    `    placementPercentage: '${e.placementPercentage}',`,
    `    topRecruiters: ${JSON.stringify(e.topRecruiters)},`,
    `    hostelFees: '${e.hostelFees}',`,
    `    roi: '${e.roi}',`,
    `    facilities: ${JSON.stringify(e.facilities)},`,
    `    pros: ${JSON.stringify(e.pros)},`,
    `    cons: ${JSON.stringify(e.cons)},`,
    `    reviews: ${JSON.stringify(e.reviews)},`,
    `    website: '${e.website}'`
  ];
  return '  {\n' + fields.join('\n') + '\n  }';
}

function escVal(v) {
  return typeof v === 'string' && (v.includes("'") || v.includes('\u2018') || v.includes('\u2019')) ? `'${esc(v)}'` : `'${v}'`;
}

const entryMap = {};
for (const e of allEntries) entryMap[e.id] = e;

let output = result.join('\n');
output = output.replace(/\n\];$/, '');

let first = true;
for (const section of sections) {
  output += `,\n  // ========================\n  ${section.comment}\n  // ========================\n`;
  for (const id of section.entries) {
    if (!first) output += ',\n';
    first = false;
    output += genEntry(entryMap[id]);
  }
}
output += '\n];\n';

fs.writeFileSync(FILE, output);
console.log(`Wrote ${FILE} successfully`);
