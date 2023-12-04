export default function useStringTranslator(stringToBeTranslated: string, mode: string): string {

  const latArray = ['dz', 'DZ', 'DJ', 'dj', 'nj', 'NJ', 'LJ', 'lj', 'A', 'B', 'C', 'Č', 'Ć', 'D', 'Đ', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'Lj', 'M', 'N', 'Nj', 'O', 'P', 'R', 'S', 'T', 'U', 'V', 'Z', 'Ž', 'Š', 'Dž', 'a', 'b', 'c', 'č', 'ć', 'd', 'đ', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'lj', 'm', 'n', 'nj', 'o', 'p', 'r', 's', 't', 'u', 'v', 'z', 'ž', 'š', 'dž'];

  const cyrArray = ['Џ', 'Џ', 'Ђ', 'Ђ', 'Њ', 'Њ', 'Љ', 'Љ', 'А', 'Б', 'Ц', 'Ч', 'Ћ', 'Д', 'Ђ', 'Е', 'Ф', 'Г', 'Х', 'И', 'Ј', 'К', 'Л', 'Љ', 'М', 'Н', 'Њ', 'О', 'П', 'Р', 'С', 'Т', 'У', 'В', 'З', 'Ж', 'Ш', 'Џ', 'а', 'б', 'ц', 'ч', 'ћ', 'д', 'ђ', 'е', 'ф', 'г', 'х', 'и', 'ј', 'к', 'л', 'љ', 'м', 'н', 'њ', 'о', 'п', 'р', 'с', 'т', 'у', 'в', 'з', 'ж', 'ш', 'џ'];

  let changedString = '';

  function changeLettersLatToCyr(currentValue: string, index: number) {
    if (stringToBeTranslated.includes(currentValue)) {
      if (!changedString) {
        changedString = stringToBeTranslated.replaceAll(currentValue, cyrArray[index]);
      } else {
        changedString = changedString.replaceAll(currentValue, cyrArray[index]);
      }
    }
  }

  function changeLettersCyrToLat(currentValue: string, index: number) {
    if (stringToBeTranslated.includes(currentValue)) {
      if (!changedString) {
        changedString = stringToBeTranslated.replaceAll(currentValue, latArray[index]);
      } else {
        changedString = changedString.replaceAll(currentValue, latArray[index]);
      }
    }
  }

  mode === 'latToCyr' ?
    latArray.forEach(changeLettersLatToCyr) :
    cyrArray.forEach(changeLettersCyrToLat);

  if(changedString === ''){
    return stringToBeTranslated;
  }else{
    return changedString
  }
};
