const aliases: Record<string,string[]> = {
  ml: ['machine learning','artificial intelligence','data science','deep learning','pytorch','tensorflow'],
  frontend: ['frontend','react','next.js','javascript','typescript','web developer'],
  backend: ['backend','node.js','python','java','api developer'],
  python: ['python','django','fastapi','pandas','data science','machine learning'],
  data: ['data analyst','data science','data scientist','sql','analytics','machine learning'],
  marketing: ['digital marketing','smm','seo','content marketing','social media'],
  finance: ['accounting','finance','financial analyst','banking','audit','economics'],
  design: ['ui/ux','ux','graphic design','figma','product designer'],
  business: ['business development','sales','operations','product','management']
};

export function expandSearchTerms(input = '') {
  const key = input.toLowerCase().trim();
  return [input, ...(aliases[key] ?? [])].filter(Boolean).join(' ');
}

export function textMatches(input:string, values:string[]) {
  const query = expandSearchTerms(input).toLowerCase();
  return values.some(value => query.includes(value.toLowerCase()) || value.toLowerCase().includes(input.toLowerCase()));
}
