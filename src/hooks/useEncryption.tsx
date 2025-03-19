import SimpleCrypto from "simple-crypto-js";
const salt_key = import.meta.env.VITE_ENCRYPTION_KEY;
const simpleCrypto = new SimpleCrypto(salt_key);

const useEncryption = () => {
  
  const encrypt = async (data: string) => {
    return simpleCrypto.encrypt(data);
  };

  const decrypt = async (ciphertext: string)=> {
    try {
        return simpleCrypto.decrypt(ciphertext);
      } catch (error) {
        return null;
      }
  };


  return {
    encrypt,
    decrypt,
  };
};

export default useEncryption;