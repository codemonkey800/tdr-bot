export const BOIS = [
  {
    name: 'Jeremy',
    ids: ['218579527041941507', '937593603436474399'],
  },
  {
    name: 'Jack',
    ids: ['937586847226404884'],
  },
  {
    name: 'Kristian',
    ids: ['214207363639410688', '913636980926058507'],
  },
  {
    name: 'David',
    ids: ['215350185293774849'],
  },
  {
    name: 'Kris',
    ids: ['214214140628041728'],
  },
  {
    name: 'Baker',
    ids: ['164156387947970561'],
  },
  {
    name: 'Carlos',
    ids: ['216131912807350273'],
  },
  {
    name: 'Shane',
    ids: ['219363815580631040'],
  },
]

export function getBoisPrompt(): string {
  return BOIS.map(
    (boi) => `${boi.name} has the IDs: ${boi.ids.join(', ')}`,
  ).join('\n')
}
