import { Search , Volume2} from 'lucide-react';
import {useState} from 'react';
import axios from 'axios';
import './Dictonary.css';
function Dictonary()
{
    const [word , setWord] = useState("");
    const [data , setData] = useState(null);
    const [loading , setLoading] = useState(false);
    const [error ,setError] = useState('');
   

   const search = async () => {
  if (!word.trim()) return;
  setLoading(true);
  setError('');
  try {
    setData(null);
    const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    
    if (Array.isArray(response.data) && response.data.length > 0) {
      setData(response.data[0]);
    } else {
      throw new Error("Invalid response format");
    }

  } catch (err) {
    setData(null);
    setError(err.response?.status === 404 ? "Word not found" : "An error occurred");
  } finally {
    setLoading(false);
  }
};

    const pronounce = (word) =>
    {
        const utterance = new SpeechSynthesisUtterance(word);
        speechSynthesis.speak(utterance);
    };

    return(
        <>
        <h1>Dictionary App</h1>
        <p className='subhead'>Search for word meaning and pronounciation</p>
        <input
          value={word}
          type = 'text'
          onChange={(e)=>setWord(e.target.value)}
          placeholder = 'Enter word to search...'
        />
        <button onClick={search} className='sbtn'>
            <Search size={20} color='grey' style={{cursor:"pointer"}}/>
        </button>
        {loading  && <p style={{textAlign:"center",marginTop:50,fontSize:20}}>Loading...</p>}
        {error && <p style={{textAlign:"center",marginTop:20}}>{error}</p>}
        { data && (
        
              <div className='result'>
                <div className='wordheader'>
                  <button onClick={()=>pronounce(data.word)} style={{backgroundColor:"white",border:"none",position:"relative",top:5}}><Volume2 style={{cursor:"pointer"}} size={22}/></button>
                 <span><strong>{data.word}</strong></span>
                 
               </div>
               <p><strong>Phonetic:</strong>{data.phonetic}</p>
               {data.meanings.map((meaning , index)=>
              (
                  <div key={index}>
                      <p><strong>Parts of speech:</strong>{meaning.partOfSpeech}</p>
                      <ol>
                        {meaning.definitions.map((def , i)=>(
                            <li key={i} style={{marginBottom:20}}>
                                {def.definition}
                                {def.example && <div>e.g. {def.example}</div>}
                            </li>
                        ))}
                      </ol>
                  </div>
               ))}

              </div>
        )}
        </>
    )
}

export default Dictonary;