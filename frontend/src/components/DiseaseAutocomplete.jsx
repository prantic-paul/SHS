/**
 * Disease Autocomplete Component
 * Provides autocomplete functionality for selecting diseases from a predefined list
 */
import { useState, useEffect, useRef } from 'react';
import { FiX, FiSearch } from 'react-icons/fi';

// List of 773 unique diseases
const DISEASES = [
  "panic disorder", "vocal cord polyp", "turner syndrome", "cryptorchidism", 
  "poisoning due to ethylene glycol", "atrophic vaginitis", "fracture of the hand",
  "cellulitis or abscess of mouth", "eye alignment disorder", "headache after lumbar puncture",
  "pyloric stenosis", "salivary gland disorder", "osteochondrosis", "injury to the knee",
  "metabolic disorder", "vaginitis", "sick sinus syndrome", "tinnitus of unknown cause",
  "glaucoma", "eating disorder", "transient ischemic attack", "pyelonephritis",
  "rotator cuff injury", "chronic pain disorder", "problem during pregnancy", "liver cancer",
  "atelectasis", "injury to the hand", "choledocholithiasis", "injury to the hip",
  "cirrhosis", "thoracic aortic aneurysm", "subdural hemorrhage", "diabetic retinopathy",
  "fibromyalgia", "ischemia of the bowel", "fetal alcohol syndrome", "peritonitis",
  "injury to the abdomen", "acute pancreatitis", "thrombophlebitis", "asthma",
  "foreign body in the vagina", "restless leg syndrome", "emphysema", "cysticercosis",
  "induced abortion", "teething syndrome", "infectious gastroenteritis", "acute sinusitis",
  "substance-related mental disorder", "postpartum depression", "coronary atherosclerosis",
  "spondylitis", "pituitary adenoma", "uterine fibroids", "idiopathic nonmenstrual bleeding",
  "chalazion", "ovarian torsion", "retinopathy due to high blood pressure", "vaginal yeast infection",
  "mastoiditis", "lung contusion", "hypertrophic obstructive cardiomyopathy (hocm)", "ingrown toe nail",
  "pulmonary eosinophilia", "corneal disorder", "foreign body in the gastrointestinal tract",
  "endophthalmitis", "intestinal malabsorption", "viral warts", "hyperhidrosis", "stroke",
  "pilonidal cyst", "crushing injury", "normal pressure hydrocephalus", "alopecia",
  "hashimoto thyroiditis", "flat feet", "nonalcoholic liver disease (nash)", "hemarthrosis",
  "pelvic organ prolapse", "fracture of the arm", "coagulation (bleeding) disorder",
  "intracranial hemorrhage", "hyperkalemia", "cornea infection", "abscess of the lung",
  "dengue fever", "chronic sinusitis", "cholesteatoma", "volvulus", "injury to the finger",
  "poisoning due to analgesics", "atrial fibrillation", "pinworm infection", "urethral valves",
  "open wound of the neck", "achalasia", "conductive hearing loss", "abdominal hernia",
  "cerebral palsy", "marijuana abuse", "cryptococcosis", "obesity", "indigestion", "bursitis",
  "esophageal cancer", "pulmonary congestion", "juvenile rheumatoid arthritis", "actinic keratosis",
  "acute otitis media", "astigmatism", "tuberous sclerosis", "empyema", "presbyacusis",
  "neonatal jaundice", "chronic obstructive pulmonary disease (copd)", "dislocation of the elbow",
  "spondylosis", "herpangina", "injury to the shoulder", "poisoning due to antidepressants",
  "infection of open wound", "deep vein thrombosis (dvt)", "protein deficiency", "myoclonus",
  "bone spur of the calcaneous", "von willebrand disease", "open wound of the back",
  "heart block", "colonic polyp", "magnesium deficiency", "female infertility of unknown cause",
  "pericarditis", "attention deficit hyperactivity disorder (adhd)", "pulmonic valve disease",
  "tietze syndrome", "cranial nerve palsy", "injury to the arm", "conversion disorder",
  "complex regional pain syndrome", "otosclerosis", "injury to the trunk", "hypothyroidism",
  "primary insomnia", "lice", "vitamin b12 deficiency", "diabetes", "vulvodynia", "endometriosis",
  "vasculitis", "concussion", "oral leukoplakia", "chronic kidney disease", "bladder disorder",
  "chorioretinitis", "priapism", "myositis", "mononucleosis", "neuralgia",
  "polycystic kidney disease", "bipolar disorder", "amyloidosis",
  "chronic inflammatory demyelinating polyneuropathy (cidp)", "gastroesophageal reflux disease (gerd)",
  "vitreous hemorrhage", "poisoning due to antimicrobial drugs", "open wound of the mouth",
  "scleroderma", "myasthenia gravis", "hypoglycemia", "idiopathic absence of menstruation",
  "dislocation of the ankle", "carbon monoxide poisoning", "panic attack", "plantar fasciitis",
  "hyperopia", "poisoning due to sedatives", "pemphigus", "peyronie disease", "hiatal hernia",
  "extrapyramidal effect of drugs", "meniere disease", "anal fissure", "allergy",
  "chronic otitis media", "fracture of the finger", "hirschsprung disease", "polymyalgia rheumatica",
  "lymphedema", "bladder cancer", "acute bronchospasm", "acute glaucoma", "open wound of the chest",
  "dislocation of the patella", "sciatica", "hypercalcemia", "stress incontinence", "varicose veins",
  "benign kidney cyst", "hydrocele of the testicle", "degenerative disc disease", "hirsutism",
  "dislocation of the foot", "hydronephrosis", "diverticulosis", "pain after an operation",
  "huntington disease", "lymphoma", "dermatitis due to sun exposure",
  "anemia due to chronic kidney disease", "injury to internal organ", "scleritis", "pterygium",
  "fungal infection of the skin", "insulin overdose",
  "syndrome of inappropriate secretion of adh (siadh)", "foreign body in the ear",
  "premenstrual tension syndrome", "orbital cellulitis", "injury to the leg",
  "hepatic encephalopathy", "bone cancer", "syringomyelia", "pulmonary fibrosis",
  "mitral valve disease", "parkinson disease", "gout", "otitis media", "drug abuse (opioids)",
  "myelodysplastic syndrome", "fracture of the shoulder", "acute kidney injury",
  "threatened pregnancy", "intracranial abscess", "gum disease", "open wound from surgical incision",
  "gastrointestinal hemorrhage", "seborrheic dermatitis", "drug abuse (methamphetamine)",
  "torticollis", "poisoning due to antihypertensives", "tension headache", "alcohol intoxication",
  "scurvy", "narcolepsy", "food allergy", "labyrinthitis", "anxiety", "impulse control disorder",
  "stenosis of the tear duct", "abscess of nose", "omphalitis", "leukemia", "bell palsy",
  "conjunctivitis due to allergy", "drug reaction", "adrenal cancer", "myopia", "osteoarthritis",
  "thyroid disease", "pharyngitis", "chronic rheumatic fever", "hypocalcemia", "macular degeneration",
  "pneumonia", "cold sore", "premature ventricular contractions (pvcs)", "testicular cancer",
  "hydrocephalus", "breast cancer", "anemia due to malignancy", "esophageal varices",
  "endometrial cancer", "cystic fibrosis", "intertrigo (skin condition)", "parathyroid adenoma",
  "glucocorticoid deficiency", "temporomandibular joint disorder", "wilson disease",
  "vesicoureteral reflux", "vitamin a deficiency", "gonorrhea", "fracture of the rib", "ependymoma",
  "hepatitis due to a toxin", "vaginal cyst", "open wound of the shoulder", "ectopic pregnancy",
  "chronic knee pain", "pinguecula", "hypergammaglobulinemia", "alcohol abuse",
  "carpal tunnel syndrome", "pituitary disorder", "kidney stone", "autism", "cat scratch disease",
  "chronic glaucoma", "retinal detachment", "aplastic anemia", "overflow incontinence",
  "hemolytic anemia", "lateral epicondylitis (tennis elbow)", "open wound of the eye", "syphilis",
  "diabetic kidney disease", "nose disorder", "drug withdrawal", "dental caries",
  "hypercholesterolemia", "fracture of the patella", "kidney failure", "fracture of the neck",
  "muscle spasm", "hemophilia", "hyperosmotic hyperketotic state", "peritonsillar abscess",
  "gastroparesis", "itching of unknown cause", "polycythemia vera", "thrombocytopenia",
  "head and neck cancer", "pseudohypoparathyroidism", "goiter", "urge incontinence",
  "edward syndrome", "open wound of the arm", "muscular dystrophy", "mittelschmerz",
  "corneal abrasion", "anemia of chronic disease", "dysthymic disorder", "scarlet fever",
  "hypertensive heart disease", "drug abuse (barbiturates)", "polycystic ovarian syndrome (pcos)",
  "encephalitis", "cyst of the eyelid", "balanitis", "foreign body in the throat",
  "drug abuse (cocaine)", "optic neuritis", "alcohol withdrawal",
  "premature atrial contractions (pacs)", "hemiplegia", "hammer toe", "open wound of the cheek",
  "joint effusion", "open wound of the knee", "meningioma", "brain cancer", "placental abruption",
  "seasonal allergies (hay fever)", "lung cancer", "primary kidney disease", "uterine cancer",
  "dry eye of unknown cause", "fibrocystic breast disease", "fungal infection of the hair",
  "tooth abscess", "envenomation from spider or animal bite", "vacterl syndrome",
  "vertebrobasilar insufficiency", "rectal disorder", "atonic bladder",
  "benign paroxysmal positional vertical (bppv)", "blepharospasm", "sarcoidosis",
  "metastatic cancer", "trigger finger (finger disorder)", "stye", "hemochromatosis",
  "osteochondroma", "cushing syndrome", "typhoid fever", "vitreous degeneration",
  "atrophic skin condition", "aspergillosis", "uterine atony", "trichinosis", "whooping cough",
  "open wound of the lip", "subacute thyroiditis", "oral mucosal lesion", "open wound due to trauma",
  "intracerebral hemorrhage", "alzheimer disease", "vaginismus",
  "systemic lupus erythematosis (sle)", "premature ovarian failure", "thoracic outlet syndrome",
  "ganglion cyst", "dislocation of the knee", "crohn disease", "postoperative infection",
  "folate deficiency", "fluid overload", "atrial flutter", "skin disorder", "floaters",
  "tooth disorder", "heart attack", "open wound of the abdomen", "fracture of the leg",
  "oral thrush (yeast infection)", "pityriasis rosea", "allergy to animals",
  "orthostatic hypotension", "obstructive sleep apnea (osa)", "hypokalemia", "psoriasis",
  "dislocation of the shoulder", "intussusception", "cervicitis", "abscess of the pharynx",
  "primary thrombocythemia", "arthritis of the hip", "decubitus ulcer", "hypernatremia",
  "sensorineural hearing loss", "chronic ulcer", "osteoporosis", "ileus", "sickle cell crisis",
  "urethritis", "prostatitis", "otitis externa (swimmer's ear)", "poisoning due to anticonvulsants",
  "testicular torsion", "tricuspid valve disease", "urethral stricture", "vitamin d deficiency",
  "hydatidiform mole", "pain disorder affecting the neck", "tuberculosis", "pelvic fistula",
  "acute bronchiolitis", "presbyopia", "dementia", "insect bite", "paroxysmal ventricular tachycardia",
  "congenital heart defect", "connective tissue disorder", "foreign body in the eye",
  "poisoning due to gas", "pyogenic skin infection", "endometrial hyperplasia", "acanthosis nigricans",
  "central atherosclerosis", "viral exanthem", "noninfectious gastroenteritis",
  "benign prostatic hyperplasia (bph)", "menopause", "primary immunodeficiency", "ovarian cancer",
  "cataract", "dislocation of the hip", "spinal stenosis", "intestinal obstruction",
  "heart contusion", "congenital malformation syndrome", "sporotrichosis", "lymphangitis",
  "wernicke korsakoff syndrome", "intestinal disease", "acute bronchitis",
  "persistent vomiting of unknown cause", "open wound of the foot", "myocarditis", "preeclampsia",
  "ischemic heart disease", "neurofibromatosis", "chickenpox", "pancreatic cancer",
  "neuropathy due to drugs", "croup", "idiopathic excessive menstruation", "amblyopia",
  "meckel diverticulum", "dislocation of the wrist", "ear drum damage", "erectile dysfunction",
  "temporary or benign blood in urine", "kidney disease due to longstanding hypertension",
  "chondromalacia of the patella", "onychomycosis", "urethral disorder", "lyme disease",
  "iron deficiency anemia", "acute respiratory distress syndrome (ards)",
  "toxic multinodular goiter", "open wound of the finger", "autonomic nervous system disorder",
  "psychosexual disorder", "anemia", "tendinitis", "common cold", "amyotrophic lateral sclerosis (als)",
  "central retinal artery or vein occlusion", "paroxysmal supraventricular tachycardia",
  "venous insufficiency", "trichomonas infection", "acne", "depression", "drug abuse",
  "urinary tract obstruction", "diabetes insipidus", "iridocyclitis", "varicocele of the testicles",
  "irritable bowel syndrome", "fracture of the foot", "ovarian cyst", "chlamydia",
  "parasitic disease", "fracture of the jaw", "lipoma", "female genitalia infection",
  "pulmonary hypertension", "thyroid nodule", "broken tooth", "dumping syndrome", "lymphadenitis",
  "injury to the face", "aortic valve disease", "rheumatoid arthritis", "spermatocele", "impetigo",
  "anal fistula", "hypothermia", "oppositional disorder", "migraine", "diabetic peripheral neuropathy",
  "testicular disorder", "gestational diabetes", "hidradenitis suppurativa", "valley fever",
  "conjunctivitis due to bacteria", "lewy body dementia", "multiple myeloma", "head injury",
  "ascending cholangitis", "idiopathic irregular menstrual cycle", "interstitial lung disease",
  "mononeuritis", "malaria", "somatization disorder", "hypovolemia", "schizophrenia",
  "knee ligament or meniscus tear", "endocarditis", "sepsis", "heat stroke", "cholecystitis",
  "cardiac arrest", "cardiomyopathy", "social phobia", "meningitis", "spherocytosis",
  "hormone disorder", "raynaud disease", "reactive arthritis", "scabies", "ear wax impaction",
  "hypertension of pregnancy", "peripheral arterial embolism", "rosacea", "fracture of the skull",
  "uveitis", "fracture of the facial bones", "tracheitis", "jaw disorder", "perirectal infection",
  "breast cyst", "post-traumatic stress disorder (ptsd)", "kidney cancer", "vulvar cancer",
  "blepharitis", "celiac disease", "cystitis", "sickle cell anemia", "subconjunctival hemorrhage",
  "hemorrhoids", "contact dermatitis", "sinus bradycardia", "high blood pressure",
  "pelvic inflammatory disease", "liver disease", "chronic constipation", "thyroid cancer", "flu",
  "friedrich ataxia", "tic (movement) disorder", "skin polyp", "brachial neuritis", "cervical cancer",
  "adrenal adenoma", "esophagitis", "gas gangrene", "yeast infection", "spina bifida",
  "drug poisoning due to medication", "alcoholic liver disease", "malignant hypertension",
  "diverticulitis", "moyamoya disease", "heat exhaustion", "psychotic disorder", "frostbite",
  "atrophy of the corpus cavernosum", "smoking or tobacco addiction", "sprain or strain",
  "essential tremor", "open wound of the ear", "foreign body in the nose",
  "idiopathic painful menstruation", "down syndrome", "idiopathic infrequent menstruation",
  "pneumothorax", "de quervain disease", "fracture of the vertebra",
  "human immunodeficiency virus infection (hiv)", "mumps", "subarachnoid hemorrhage",
  "acute fatty liver of pregnancy (aflp)", "ectropion", "scar", "lactose intolerance",
  "eustachian tube dysfunction (ear disorder)", "appendicitis", "graves disease",
  "dissociative disorder", "open wound of the face", "dislocation of the vertebra", "phimosis",
  "hyperemesis gravidarum", "pregnancy", "thalassemia", "placenta previa", "epidural hemorrhage",
  "septic arthritis", "athlete's foot", "pleural effusion", "aphakia", "vulvar disorder",
  "sialoadenitis", "gynecomastia", "urinary tract infection", "histoplasmosis", "erythema multiforme",
  "scoliosis", "bunion", "arrhythmia", "trigeminal neuralgia", "ankylosing spondylitis",
  "peripheral nerve disorder", "sebaceous cyst", "poisoning due to antipsychotics", "neurosis",
  "prostate cancer", "cerebral edema", "dislocation of the finger", "birth trauma",
  "chronic pancreatitis", "hematoma", "carcinoid syndrome", "open wound of the head",
  "seborrheic keratosis", "burn", "spontaneous abortion", "genital herpes", "adjustment reaction",
  "gallstone", "multiple sclerosis", "zenker diverticulum", "fracture of the pelvis",
  "pneumoconiosis", "hyperlipidemia", "ulcerative colitis", "male genitalia infection", "hpv",
  "angina", "injury to the spinal cord", "nasal polyp", "lichen simplex", "trichiasis", "acariasis",
  "colorectal cancer", "skin pigmentation disorder", "factitious disorder",
  "lymphogranuloma venereum", "galactorrhea of unknown cause", "g6pd enzyme deficiency",
  "nerve impingement near the shoulder", "toxoplasmosis", "fibroadenoma", "open wound of the hand",
  "missed abortion", "diabetic ketoacidosis", "granuloma inguinale",
  "obsessive compulsive disorder (ocd)", "injury of the ankle", "hyponatremia",
  "stricture of the esophagus", "fracture of the ankle", "soft tissue sarcoma", "bone disorder",
  "epilepsy", "personality disorder", "shingles (herpes zoster)", "tourette syndrome",
  "avascular necrosis", "strep throat", "spinocerebellar ataxia", "osteomyelitis", "sjogren syndrome",
  "adhesive capsulitis of the shoulder", "viral hepatitis", "tonsillar hypertrophy", "gastritis",
  "skin cancer", "rheumatic fever", "aphthous ulcer", "tonsillitis", "intestinal cancer",
  "rocky mountain spotted fever", "stomach cancer", "developmental disability",
  "acute stress reaction", "delirium", "callus", "guillain barre syndrome", "lumbago",
  "deviated nasal septum", "hemangioma", "peripheral arterial disease", "chronic back pain",
  "heart failure", "conjunctivitis", "herniated disk", "rhabdomyolysis",
  "breast infection (mastitis)", "abdominal aortic aneurysm", "pulmonary embolism",
  "conduct disorder", "mastectomy", "epididymitis", "premature rupture of amniotic membrane",
  "molluscum contagiosum", "necrotizing fasciitis", "benign vaginal discharge (leukorrhea)",
  "bladder obstruction", "melanoma", "cervical disorder", "laryngitis", "dyshidrosis",
  "poisoning due to opioids", "diaper rash", "lichen planus", "gastroduodenal ulcer",
  "inguinal hernia", "eczema", "asperger syndrome", "mucositis", "paronychia",
  "open wound of the jaw", "white blood cell disease", "kaposi sarcoma", "spondylolisthesis",
  "pseudotumor cerebri", "conjunctivitis due to virus", "open wound of the nose"
];

const DiseaseAutocomplete = ({ selectedDiseases = [], onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    // Handle click outside
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim().length > 0) {
      // Filter diseases that match the input
      const filtered = DISEASES.filter(
        disease =>
          disease.toLowerCase().includes(value.toLowerCase()) &&
          !selectedDiseases.includes(disease)
      ).slice(0, 10); // Limit to 10 suggestions

      setSuggestions(filtered);
      setShowSuggestions(true);
      setHighlightedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectDisease = (disease) => {
    if (!selectedDiseases.includes(disease)) {
      onChange([...selectedDiseases, disease]);
    }
    setInputValue('');
    setSuggestions([]);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
  };

  const handleRemoveDisease = (diseaseToRemove) => {
    onChange(selectedDiseases.filter(disease => disease !== diseaseToRemove));
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSelectDisease(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setHighlightedIndex(-1);
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-3">
      {/* Input Field */}
      <div className="relative">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (inputValue.trim().length > 0) {
                setShowSuggestions(true);
              }
            }}
            placeholder="Type to search diseases (e.g., diabetes, asthma)..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto"
          >
            {suggestions.map((disease, index) => (
              <button
                key={disease}
                type="button"
                onClick={() => handleSelectDisease(disease)}
                className={`w-full text-left px-4 py-2.5 hover:bg-blue-50 transition-colors capitalize ${
                  index === highlightedIndex ? 'bg-blue-50' : ''
                } ${index !== suggestions.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                {disease}
              </button>
            ))}
          </div>
        )}

        {/* No results message */}
        {showSuggestions && inputValue.trim().length > 0 && suggestions.length === 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
            No matching diseases found
          </div>
        )}
      </div>

      {/* Selected Diseases (Tags/Chips) */}
      {selectedDiseases.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedDiseases.map((disease) => (
            <div
              key={disease}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium group hover:bg-blue-200 transition-colors"
            >
              <span className="capitalize">{disease}</span>
              <button
                type="button"
                onClick={() => handleRemoveDisease(disease)}
                className="p-0.5 hover:bg-blue-300 rounded-full transition-colors"
                aria-label={`Remove ${disease}`}
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Helper Text */}
      <p className="text-sm text-gray-500">
        {selectedDiseases.length === 0
          ? 'Start typing to search from 773 diseases'
          : `${selectedDiseases.length} disease${selectedDiseases.length !== 1 ? 's' : ''} selected`}
      </p>
    </div>
  );
};

export default DiseaseAutocomplete;
