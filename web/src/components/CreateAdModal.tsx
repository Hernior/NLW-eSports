import { Check, GameController } from 'phosphor-react';
import { Input } from './Form/input';
import * as Dialog from '@radix-ui/react-dialog';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as SelectPrimitive from '@radix-ui/react-select';
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@radix-ui/react-icons';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { useEffect, useState, FormEvent } from 'react';
import axios from 'axios';

interface Game {
  id: string;
  title: string;
}

export function CreateAdModal() {
  const [games, setGames] = useState<Game[]>([])
  const [weekDays, setWeekDays] = useState<string[]>([])
  const [useVoiceChannel, setUseVoiceChannel] = useState<boolean>(false)

  useEffect(() => {
    axios('http://localhost:3333/games')
    .then(response => {
      setGames(response.data)
    })
  }, [])

  async function handleCreateAd(event: FormEvent) {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement)
    const data = Object.fromEntries(formData)

    console.log(data);
    console.log(weekDays);
    console.log(useVoiceChannel);

    if (!data.name) {
      return;
    }

    try {
      axios.post(`http://localhost:3333/games/${data.game}/ads`, {
        name: data.name,
        yearsPlaying: Number(data.yearsPlaying),
        discord: data.discord,
        weekDays: weekDays.map(Number),
        hourStart: data.hourStart,
        hourEnd: data.hourEnd,
        useVoiceChannel: useVoiceChannel,
      })

      alert('Anúncio criado com sucesso!')
    } catch (error) {
      console.log(error);
      alert('Falha ao criar o anúncio!')
    }
    
  }
  
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black/60 inset-0 fixed" />
      <Dialog.Content className="fixed bg-[#2A2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480] shadow-lg shadow-black/25">
        <Dialog.Title className="text-3xl font-black">Publique um anúncio</Dialog.Title>
        <form onSubmit={handleCreateAd} className="mt-8 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="game" className="font-semibold">Qual o game?</label>
            <SelectPrimitive.Root name="game" defaultValue="default">
              <SelectPrimitive.Trigger asChild className="w-full flex bg-zinc-900 rounded h-10 pl-4 pt-3 text-sm">
                <div>
                  <SelectPrimitive.Value />
                  <SelectPrimitive.Icon className="right right-14 ml-2 fixed">
                    <ChevronDownIcon />
                  </SelectPrimitive.Icon>
                </div>
              </SelectPrimitive.Trigger>
              <SelectPrimitive.Content>
                <SelectPrimitive.ScrollUpButton className="flex items-center justify-center text-gray-700 dark:text-gray-300">
                  <ChevronUpIcon />
                </SelectPrimitive.ScrollUpButton>
                <SelectPrimitive.Viewport className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full">
                  <SelectPrimitive.Group>
                    <SelectPrimitive.Item
                      key={'default'}
                      value="default"
                      className="relative flex items-center px-8 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 font-medium focus:bg-gray-100 dark:focus:bg-gray-900 radix-disabled:opacity-50 focus:outline-none select-none"
                      disabled={true}
                    >
                      <SelectPrimitive.ItemText>Selecione o game que deseja jogar</SelectPrimitive.ItemText>
                      <SelectPrimitive.ItemIndicator className="absolute left-2 inline-flex items-center">
                        <CheckIcon />
                      </SelectPrimitive.ItemIndicator>
                    </SelectPrimitive.Item>
                    {games.map(
                      game => (
                        <SelectPrimitive.Item
                          key={game.id}
                          value={game.id}
                          className="relative flex items-center px-8 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 font-medium focus:bg-gray-100 dark:focus:bg-gray-900 radix-disabled:opacity-50 focus:outline-none select-none"
                          // className={cx(
                          //   "relative flex items-center px-8 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 font-medium focus:bg-gray-100 dark:focus:bg-gray-900",
                          //   "radix-disabled:opacity-50",
                          //   "focus:outline-none select-none"
                          // )}
                        >
                          <SelectPrimitive.ItemText>{game.title}</SelectPrimitive.ItemText>
                          <SelectPrimitive.ItemIndicator className="absolute left-2 inline-flex items-center">
                            <CheckIcon />
                          </SelectPrimitive.ItemIndicator>
                        </SelectPrimitive.Item>
                      )
                    )}
                  </SelectPrimitive.Group>
                </SelectPrimitive.Viewport>
                <SelectPrimitive.ScrollDownButton className="flex items-center justify-center text-gray-700 dark:text-gray-300">
                  <ChevronDownIcon />
                </SelectPrimitive.ScrollDownButton>
              </SelectPrimitive.Content>
            </SelectPrimitive.Root>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="name">Seu nome (ou nickname)</label>
            <Input name="name" id="name" type="text" placeholder="Como te chamam dentro do game?" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="yearsPlaying">Joga há quantos anos?</label>
              <Input name="yearsPlaying" id="yearsPlaying" type="text" placeholder="Tudo bem ser ZERO" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="discord">Qual seu Discord?</label>
              <Input name="discord" id="discord" type="text" placeholder="Usuario#0000" />
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="weekDays">Quando costuma jogar?</label>
              <ToggleGroup.Root
                type="multiple"
                className="grid grid-cols-4 gap-2"
                value={weekDays}
                onValueChange={setWeekDays}
              >
                <ToggleGroup.Item
                  value="0"
                  title="Domingo"
                  className={`w-8 h-8 rounded ${weekDays.includes('0') ? 'bg-violet-500' : 'bg-zinc-900'}`}>D</ToggleGroup.Item>
                <ToggleGroup.Item
                  value="1"
                  title="Segunda"
                  className={`w-8 h-8 rounded ${weekDays.includes('1') ? 'bg-violet-500' : 'bg-zinc-900'}`}>S</ToggleGroup.Item>
                <ToggleGroup.Item
                  value="2"
                  title="Terça"
                  className={`w-8 h-8 rounded ${weekDays.includes('2') ? 'bg-violet-500' : 'bg-zinc-900'}`}>T</ToggleGroup.Item>
                <ToggleGroup.Item
                  value="3"
                  title="Quarta"
                  className={`w-8 h-8 rounded ${weekDays.includes('3') ? 'bg-violet-500' : 'bg-zinc-900'}`}>Q</ToggleGroup.Item>
                <ToggleGroup.Item
                  value="4"
                  title="Quinta"
                  className={`w-8 h-8 rounded ${weekDays.includes('4') ? 'bg-violet-500' : 'bg-zinc-900'}`}>Q</ToggleGroup.Item>
                <ToggleGroup.Item
                  value="5"
                  title="Sexta"
                  className={`w-8 h-8 rounded ${weekDays.includes('5') ? 'bg-violet-500' : 'bg-zinc-900'}`}>S</ToggleGroup.Item>
                <ToggleGroup.Item
                  value="6"
                  title="Sábado"
                  className={`w-8 h-8 rounded ${weekDays.includes('6') ? 'bg-violet-500' : 'bg-zinc-900'}`}>S</ToggleGroup.Item>
              </ToggleGroup.Root>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="hourStart">Qual horário do dia?</label>
              <div className="grid grid-cols-2 gap-2">
                <Input name="hourStart" id="hourStart" type="time" placeholder="De" />
                <Input name="hourEnd" id="hourEnd" type="time" placeholder="Até" />
              </div>
            </div>
          </div>

          <label className="mt-2 flex items-center gap-2 text-sm">
            <Checkbox.Root
              className="w-6 h-6 p-1 rounded bg-zinc-900"
              onCheckedChange={(checked) => {
                if (checked === true) {
                  setUseVoiceChannel(true)
                } else {
                  setUseVoiceChannel(false)
                }
              }}
              >
              <Checkbox.Indicator>
                <Check className="w-4 h-4 text-emerald-400" />
              </Checkbox.Indicator>
            </Checkbox.Root>
            Costumo me conectar ao chat de voz
          </label>
          
          <footer className="mt-4 flex justify-end gap-4">
            <Dialog.Close
              type="button"
              className="bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600">
                Cancelar
            </Dialog.Close>
            <button
              type="submit"
              className="bg-violet-500 px-5 h-12 rounded-md font-semibold flex items-center gap-3 hover:bg-violet-600">
                <GameController className="w-6 h-6"></GameController>
                Encontrar duo
            </button>
          </footer>

        </form>
      </Dialog.Content>
    </Dialog.Portal>
  )
}