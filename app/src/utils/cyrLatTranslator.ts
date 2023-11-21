
const latArray = ['dz', 'DZ', 'DJ', 'dj', 'nj', 'NJ', 'LJ', 'lj', 'A', 'B', 'C', 'Č', 'Ć', 'D', 'Đ', 'E', 'F', 'G', 'H',
                  'I', 'J', 'K', 'L', 'Lj', 'M', 'N', 'Nj', 'O', 'P', 'R', 'S', 'T', 'U', 'V', 'Z', 'Ž', 'Š', 'Dž',
                  'a', 'b', 'c', 'č', 'ć', 'd', 'đ', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'lj', 'm', 'n', 'nj',
                  'o', 'p', 'r', 's', 't', 'u', 'v', 'z', 'ž', 'š', 'dž'];

const cyrArray = ['Џ', 'Џ', 'Ђ', 'Ђ', 'Њ', 'Њ', 'Љ', 'Љ', 'А', 'Б', 'Ц', 'Ч', 'Ћ', 'Д', 'Ђ', 'Е', 'Ф', 'Г', 'Х',
                  'И', 'Ј', 'К', 'Л', 'Љ', 'М', 'Н', 'Њ', 'О', 'П', 'Р', 'С', 'Т', 'У', 'В', 'З', 'Ж', 'Ш', 'Џ',
                  'а', 'б', 'ц', 'ч', 'ћ', 'д', 'ђ', 'е', 'ф', 'г', 'х', 'и', 'ј', 'к', 'л', 'љ', 'м', 'н', 'њ',
                  'о', 'п', 'р', 'с', 'т', 'у', 'в', 'з', 'ж', 'ш', 'џ'];



export function useCyrToLat(input: string){
  for(let i = 0; i < input.length ; i++){
    const index = cyrArray.findIndex(el => el === input[i]);
    if(latArray[index]){
      input = input.replaceAll(input[i],latArray[index]);
    }
  }
  return input;
};

export function useLatToCyr(input: string){
  for(let i = 0; i < input.length ; i++){
    const index = latArray.findIndex(el => el === input[i]);
    if(cyrArray[index]){
      input = input.replaceAll(input[i],cyrArray[index]);
    }
  }
  return input;
};
