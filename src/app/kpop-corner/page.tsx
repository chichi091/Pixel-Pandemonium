
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, PlayCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const skzooCharacters = [
  { name: 'Wolf Chan', member: 'Bang Chan', fact: 'The reliable leader of the pack!', iconUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpjV1h1U7AFtT3lM_AbhT8sXtZu307CrSXEExuIo_Y-FSQhH1_ulunK54&s=10', dataAiHint: 'wolf', position: { top: '15%', left: '5%' } },
  { name: 'Leebit', member: 'Lee Know', fact: 'A bunny with amazing dance moves.', iconUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPlUHTVJpZSYq77VazcXzr50rFVOE8XuDSMHfbTx0lap3KQMkLAMidWeg&s=10', dataAiHint: 'rabbit', position: { top: '30%', left: '90%' } },
  { name: 'Dwaekki', member: 'Changbin', fact: 'A pig-bunny that loves dark concepts.', iconUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNpe-sE1q09aBFNvWFNx0wE56vOtsZD_KLIW0MoFUvPQIsyzXa8-0TjCWq&s=10', dataAiHint: 'pig bunny', position: { top: '50%', left: '10%' } },
  { name: 'Jiniret', member: 'Hyunjin', fact: 'An expressive ferret with artistic talent.', iconUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvRbjA3MnEgkh_qaRO97IAWIY3X6sY6GkkxTMD5DosHoz3l5UAs3RiT5p8&s=10', dataAiHint: 'ferret', position: { top: '85%', left: '85%' } },
  { name: 'Han Quokka', member: 'Han', fact: 'A cheerful quokka, the happiest animal on Earth.', iconUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0Bz9ac0maDczTLPv-IV624yAvQkQ_FRamk_RerSrdwxw7eLp9RDLDXCA&s=10', dataAiHint: 'quokka', position: { top: '90%', left: '50%' } },
  { name: 'BbokAri', member: 'Felix', fact: 'A cute chick known for its deep voice.', iconUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZ3GI9DJVGs9_2F1zRG0a7NlSUuBcOegkKY0HhF59LNqbBLj23PekxZWI&s=10', dataAiHint: 'chick', position: { top: '5%', left: '80%' } },
  { name: 'PuppyM', member: 'Seungmin', fact: 'A loyal and sweet puppy.', iconUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJrcnK8Z5P0bteDrDGYcSiS2niDYtsK7nT3IqLvRYEJwouW0nC0K9bJp22&s=10', dataAiHint: 'puppy', position: { top: '90%', left: '15%' } },
  { name: 'FoxI.Ny', member: 'I.N', fact: 'A desert fox and the youngest of the group.', iconUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKfdXijLF2T7D8D2xnEAjo59hAfAoZpjmKosqo47L0tb_5e7k1PxUG0ekQ&s=10', dataAiHint: 'fox', position: { top: '20%', left: '50%' } },
];

const songs = [
  { title: "Get Cool", artist: 'Stray Kids', coverUrl: 'https://upload.wikimedia.org/wikipedia/en/3/3e/Stray_Kids_-_SKZ2020.jpg', dataAiHint: 'cooking music', youtubeUrl: 'https://youtu.be/BcXwZEbOvpo?si=IjKdszddVWLAGfTP' },
  { title: 'Social Path', artist: 'Stray Kids', coverUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDo5Vq2UA7yLGGxr54OV7NAccdJuI-5gnWIQ&s', dataAiHint: 'electric synth', youtubeUrl: 'https://youtu.be/M0c04xfBtyc?si=NJ0e60vK35WCqs04' },
  { title: 'Run To You', artist: 'Seventeen', coverUrl: 'https://quteandquirky.co.za/cdn/shop/products/svt-directorscut.jpg?v=1601329719', dataAiHint: 'rock music', youtubeUrl: 'https://youtu.be/cFVwSKW2ySA?si=cPFzg4WnauU_xpTB' },
  { title: 'Rock With You', artist: 'Seventeen', coverUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/dd/d4/d4/ddd4d456-4696-06b8-2054-6d1bb6ae6718/192641682551_Cover.jpg/1200x630bf-60.jpg', youtubeUrl: 'https://youtu.be/WpuatuzSDK4?si=cVEVhChsMAXYukcb' },
  { title: 'HALAZIA', artist: 'ATEEZ', coverUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH5iZ5qkwbZKPBbf_fCzhqt1Gs8xva0dboGQ&s', dataAiHint: 'pop music', youtubeUrl: 'https://youtu.be/SszP3hlQ55Y?si=BKYhDPutLjvL1Mh2' },
  { title: 'Answer', artist: 'ATEEZ', coverUrl: 'https://upload.wikimedia.org/wikipedia/en/0/01/Treasure_Epilogue_Action_to_Answer.png', dataAiHint: 'summer pop', youtubeUrl: 'https://youtu.be/yW7wZX3DUaY?si=48iZukFUNzRbkgiL' },
  { title: 'Hip', artist: 'Mamamoo', coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Mamamoo_-_Reality_in_Black.png', dataAiHint: 'dreamy pop', youtubeUrl: 'https://youtu.be/KhTeiaCezwM?si=dcOI7ugAsqJkiiNS' },
  { title: 'Pray (I\'ll Be Your Man)', artist: 'BTOB', coverUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGHmztd1GBkIK5f4-_yqj0c-ZuFQRlPlBmNA&s', dataAiHint: 'summer pop', youtubeUrl: 'https://youtu.be/__BFUf_nJl0?si=z1RivJqnqowCO1Vx' },
  { title: "0x1=LOVESONG", artist: 'Tomorrow X Together', coverUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs8l33G0pUhZlNNhidJW6YEIJsEF8UbkWOcA&s', dataAiHint: 'cooking music', youtubeUrl: 'https://youtu.be/d5bbqKYu51w?si=cvYKyL6mV7M6-geI' },
  { title: 'Red', artist: 'The Rose', coverUrl: 'https://i.scdn.co/image/ab67616d0000b273e26b55b266c10221906aa016', dataAiHint: 'electric synth', youtubeUrl: 'https://www.youtube.com/watch?v=Ru8LG-_HGd4&list=RDRu8LG-_HGd4&start_radio=1' },
  { title: "Scream", artist: 'Dreamcatcher', coverUrl: 'https://cdn-images.dzcdn.net/images/cover/a8a2163d4dd755f021955955f39a3ad9/0x1900-000000-80-0-0.jpg', dataAiHint: 'cooking music', youtubeUrl: 'https://www.youtube.com/watch?v=FKlGHHhTOsQ&list=RDFKlGHHhTOsQ&start_radio=1' },
  { title: 'How It\'s Done', artist: 'HUNTR/X', coverUrl: 'https://cdn-images.dzcdn.net/images/cover/e54bda0628749119f7a9a05b71b40283/0x1900-000000-80-0-0.jpg', dataAiHint: 'electric synth', youtubeUrl: 'https://www.youtube.com/watch?v=QGsevnbItdU&list=RDQGsevnbItdU&start_radio=1' },
  { title: "Venom", artist: 'Stray Kids', coverUrl: 'https://cdn-images.dzcdn.net/images/cover/1c10c0aab6317c66b76d8962bc32c39e/500x500.jpg', dataAiHint: 'cooking music', youtubeUrl: 'https://www.youtube.com/watch?v=pM-jOfy_1jM&list=RDpM-jOfy_1jM&start_radio=1' },
  { title: 'Scars', artist: 'Stray Kids', coverUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhOirg-5I2ftH8f6qIBo2WH4V9m77J8kYaXA&s', dataAiHint: 'electric synth', youtubeUrl: 'https://www.youtube.com/watch?v=oUq2a6t258o&list=RDoUq2a6t258o&start_radio=1' },
  { title: "Mixtape: Time Out", artist: 'Stray Kids', coverUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e5/Stray_Kids_-_Mixtape_Time_Out.png', dataAiHint: 'cooking music', youtubeUrl: 'https://www.youtube.com/watch?v=ukIGxgdbqqI&list=RDukIGxgdbqqI&start_radio=1' },
  { title: 'Hellevator', artist: 'Stray Kids', coverUrl: 'https://upload.wikimedia.org/wikipedia/en/3/3e/Stray_Kids_-_SKZ2020.jpg', dataAiHint: 'electric synth', youtubeUrl: 'https://youtu.be/AdfIfFGCqgo?si=En3JdmdP5JrfUXjv' },
  { title: "Red Lights", artist: 'Stray Kids', coverUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtF_k7i6JKVoBNwnv5d9aEjk53r5MYJQwruA&s', dataAiHint: 'cooking music', youtubeUrl: 'https://youtu.be/k8Y6ZTjmCXs?si=FDHq1BcAhyq8_zFk' },
  { title: 'Streetlight', artist: 'Stray Kids', coverUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjALei_eFxqbEH1FvF_ummUNZN0K_lruzXyA&s', dataAiHint: 'electric synth', youtubeUrl: 'https://www.youtube.com/watch?v=_oCptmj2gIQ&list=RD_oCptmj2gIQ&start_radio=1' },
];

const memes = [
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHW6izbAy-restDvEu_jgBkMYgj4g3qr2G3gcNUhEigZpx3oJqtqoWC1BW&s=10',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4Va6YNOs0lRzbfKEmndIeHMSnp-0lGP0sqBNYO4g_1HLCm1xu8PPBFzs&s=10',
  'https://media1.tenor.com/m/6XorNYluQ98AAAAd/give-up-kpop-btob.gif',
  'https://media.tenor.com/Mdg3lwGlstkAAAAM/ofjiyu-kpop-meme.gif',
  'https://media1.tenor.com/m/0OeJgZMHD6IAAAAC/kpop-laughing-kpop.gif',
  'https://media1.tenor.com/m/1BwlCCi4R2EAAAAd/monsta-sips.gif',
  'https://media1.tenor.com/m/3AtvNcCj3gkAAAAd/kpop-demon-hunters-kpop-demon-hunter.gif',
  'https://media1.tenor.com/m/L4j0gWzUKwMAAAAd/idk-who.gif',
  'https://media1.tenor.com/m/DeJxheLHy4kAAAAd/scoupsgenre-seventeen.gif',
  'https://media1.tenor.com/m/6EveMPEoBW0AAAAd/jungwon-jungwon-blank-stare.gif',
  'https://media1.tenor.com/m/LZMdg5sbL7gAAAAd/stray-kids-skz.gif',
  'https://media.tenor.com/qlsniiEwLqcAAAAj/amazing-eric-nam.gif',
];

const SkzooIcon = ({ char, onClick }: { char: typeof skzooCharacters[0], onClick: () => void }) => (
  <Dialog>
    <DialogTrigger asChild>
      <button
        onClick={onClick}
        className="absolute transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-pink-400 rounded-full"
        style={{ top: char.position.top, left: char.position.left, transform: 'translate(-50%, -50%)', zIndex: 1 }}
      >
        <img src={char.iconUrl} alt={char.name} className="w-16 h-16 md:w-20 md:h-20 rounded-full shadow-lg" data-ai-hint={char.dataAiHint} />
      </button>
    </DialogTrigger>
    <DialogContent className="bg-secondary">
      <DialogHeader>
        <DialogTitle className="font-headline text-2xl text-primary">{char.name}</DialogTitle>
        <DialogDescription className="text-base text-muted-foreground">{char.fact}</DialogDescription>
      </DialogHeader>
      <div className="text-center mt-2">
        <p className="font-semibold">Represents: {char.member}</p>
      </div>
    </DialogContent>
  </Dialog>
);


export default function KPopCornerPage() {
  const [randomMeme, setRandomMeme] = useState('');
  const [clickedIcons, setClickedIcons] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const loadRandomMeme = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * memes.length);
    setRandomMeme(memes[randomIndex]);
  }, []);

  useEffect(() => {
    loadRandomMeme();
  }, [loadRandomMeme]);

  const handleIconClick = (charName: string) => {
    const newClickedIcons = new Set(clickedIcons);
    newClickedIcons.add(charName);
    setClickedIcons(newClickedIcons);

    if (newClickedIcons.size === skzooCharacters.length) {
      try {
        const achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
        if (!achievements.includes('Stay Forever')) {
          const newAchievements = [...achievements, 'Stay Forever'];
          localStorage.setItem('achievements', JSON.stringify(newAchievements));
          toast({
            title: '🏆 Achievement Unlocked!',
            description: 'Stay Forever - You clicked all the SKZOO characters!',
          });
        }
      } catch (error) {
        console.error("Failed to save achievement", error);
      }
    }
  };


  return (
    <div className="flex flex-col items-center min-h-screen bg-background text-foreground p-4 relative overflow-hidden">

      {skzooCharacters.map(char => (
        <SkzooIcon key={char.name} char={char} onClick={() => handleIconClick(char.name)} />
      ))}

      <div className="text-center w-full max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold font-headline text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-400 my-8 animate-pulse">
          K-Pop Corner
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start relative z-10">
          {/* Left Column: Memes */}
          <Card className="bg-secondary/50 h-full flex flex-col">
            <CardHeader>
              <CardTitle className="font-headline text-3xl text-primary">K-Pop Memes</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-between flex-grow gap-4">
              <div className="flex-grow flex items-center justify-center">
                 {randomMeme && <img src={randomMeme} alt="K-Pop Meme" className="max-w-xs md:max-w-sm rounded-lg shadow-lg" data-ai-hint="kpop meme" />}
              </div>
              <Button onClick={loadRandomMeme} variant="outline">New Meme</Button>
            </CardContent>
          </Card>

          {/* Right Column: Songs */}
          <Card className="bg-secondary/50 h-full">
            <CardHeader>
              <CardTitle className="font-headline text-3xl text-primary">Song Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <Carousel className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto" opts={{ loop: true }}>
                <CarouselContent>
                  {Array.from({ length: Math.ceil(songs.length / 6) }).map((_, pageIndex) => (
                    <CarouselItem key={pageIndex}>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-1">
                        {songs.slice(pageIndex * 6, pageIndex * 6 + 6).map((song, songIndex) => (
                           <div key={`${pageIndex}-${songIndex}`} className="bg-background/50 rounded-lg p-2 text-center flex flex-col justify-between items-center h-full">
                            <img src={song.coverUrl} alt={`${song.title} cover`} className="w-24 h-24 rounded-md mb-2 object-cover" data-ai-hint={song.dataAiHint} />
                            <div className="flex-grow flex flex-col justify-center">
                              <p className="font-bold text-sm truncate">{song.title}</p>
                              <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                            </div>
                            <Button asChild size="sm" className="mt-2 w-full text-xs">
                              <a href={song.youtubeUrl} target="_blank" rel="noopener noreferrer">
                                <PlayCircle className="mr-1 h-3 w-3" /> Play
                              </a>
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="text-black" />
                <CarouselNext className="text-black" />
              </Carousel>
            </CardContent>
          </Card>
        </div>


        <Button asChild className="mt-12 relative z-10">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Pandemonium
          </Link>
        </Button>
      </div>
    </div>
  );
}
