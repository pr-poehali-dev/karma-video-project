import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface SearchResult {
  title: string;
  snippet: string;
  url: string;
  source: string;
  type?: string;
  thumbnail?: string;
}

const SEARCH_API_URL = 'https://functions.poehali.dev/e6746de1-33e9-4ae6-81be-4dbf2ef1f47f';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('home');
  const [searchType, setSearchType] = useState('web');
  const [isListening, setIsListening] = useState(false);
  const [aiHelperOpen, setAiHelperOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const sidebarItems = [
    { id: 'bookmarks', icon: 'Bookmark', label: 'Закладки', count: 12 },
    { id: 'history', icon: 'History', label: 'История', count: 234 },
    { id: 'favorites', icon: 'Star', label: 'Избранное', count: 8 },
    { id: 'extensions', icon: 'Puzzle', label: 'Расширения', count: 5 },
    { id: 'notifications', icon: 'Bell', label: 'Уведомления', count: 3 },
    { id: 'settings', icon: 'Settings', label: 'Настройки', count: 0 },
  ];

  const quickSearchModes = [
    { id: 'web', icon: 'Search', label: 'Текст' },
    { id: 'voice', icon: 'Mic', label: 'Голос' },
    { id: 'image', icon: 'Image', label: 'Фото' },
    { id: 'music', icon: 'Music', label: 'Музыка' },
  ];

  const aiTips = [
    { title: 'Как искать голосом?', tip: 'Нажми на иконку микрофона и произнеси свой запрос' },
    { title: 'Поиск по фото', tip: 'Загрузи изображение, чтобы найти похожие картинки или информацию' },
    { title: 'Найди музыку', tip: 'Опиши песню словами: настроение, жанр или часть текста' },
    { title: 'Горячие клавиши', tip: 'Enter для поиска, Ctrl+K для быстрого поиска' },
  ];

  const handleSearch = async (query: string = searchQuery, type: string = searchType) => {
    if (!query.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    try {
      const response = await fetch(SEARCH_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          type: type
        })
      });

      const data = await response.json();
      setSearchResults(data.results || []);
      
      toast({
        title: 'Поиск выполнен',
        description: `Найдено результатов: ${data.results?.length || 0}`,
      });
    } catch (error) {
      toast({
        title: 'Ошибка поиска',
        description: 'Не удалось выполнить поиск. Попробуйте еще раз.',
        variant: 'destructive',
      });
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: 'Голосовой ввод недоступен',
        description: 'Ваш браузер не поддерживает голосовой ввод',
        variant: 'destructive',
      });
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'ru-RU';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      toast({
        title: 'Слушаю...',
        description: 'Произнесите ваш запрос',
      });
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      handleSearch(transcript, searchType);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast({
        title: 'Ошибка распознавания',
        description: 'Не удалось распознать речь',
        variant: 'destructive',
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleImageSearch = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target?.files?.[0];
      if (file) {
        toast({
          title: 'Изображение загружено',
          description: 'Выполняется поиск по изображению...',
        });
        handleSearch(`поиск по изображению: ${file.name}`, 'image');
      }
    };
    input.click();
  };

  const changeSearchType = (type: string) => {
    setSearchType(type);
    if (type === 'voice') {
      handleVoiceSearch();
    } else if (type === 'image') {
      handleImageSearch();
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-20 lg:w-64 bg-card border-r border-border flex flex-col">
        <div className="p-4 lg:p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={24} className="text-primary-foreground" />
            </div>
            <div className="hidden lg:block">
              <h1 className="text-xl font-bold text-foreground">SearchPro</h1>
              <p className="text-xs text-muted-foreground">Браузер будущего</p>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 p-2 lg:p-4">
          <nav className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 hover:bg-accent"
              onClick={() => setActiveSection('home')}
            >
              <Icon name="Home" size={20} />
              <span className="hidden lg:inline">Главная</span>
            </Button>
            {sidebarItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className="w-full justify-start gap-3 hover:bg-accent"
                onClick={() => setActiveSection(item.id)}
              >
                <Icon name={item.icon as any} size={20} />
                <span className="hidden lg:inline">{item.label}</span>
                {item.count > 0 && (
                  <Badge variant="secondary" className="ml-auto hidden lg:flex">
                    {item.count}
                  </Badge>
                )}
              </Button>
            ))}
          </nav>
        </ScrollArea>

        <div className="p-2 lg:p-4 border-t border-border">
          <Sheet open={aiHelperOpen} onOpenChange={setAiHelperOpen}>
            <SheetTrigger asChild>
              <Button
                variant="default"
                className="w-full gap-2 bg-primary hover:bg-primary/90"
              >
                <Icon name="Sparkles" size={20} />
                <span className="hidden lg:inline">ИИ Помощник</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[400px]">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Icon name="Sparkles" size={24} className="text-primary" />
                  ИИ Помощник
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Я помогу тебе освоить все возможности браузера! Вот несколько полезных советов:
                </p>
                <div className="space-y-3">
                  {aiTips.map((item, idx) => (
                    <Card key={idx} className="p-4 bg-muted hover:bg-accent transition-colors cursor-pointer">
                      <h4 className="font-semibold text-sm mb-2 text-foreground">{item.title}</h4>
                      <p className="text-xs text-muted-foreground">{item.tip}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="border-b border-border bg-card p-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Icon
                name="Search"
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                type="text"
                placeholder="Поиск в интернете..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-12 pr-40 h-14 text-lg bg-background border-border"
                disabled={isSearching}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                <Button
                  size="icon"
                  variant={isListening ? 'default' : 'ghost'}
                  onClick={handleVoiceSearch}
                  className="h-10 w-10"
                  disabled={isSearching}
                >
                  <Icon name="Mic" size={20} />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-10 w-10"
                  onClick={handleImageSearch}
                  disabled={isSearching}
                >
                  <Icon name="Image" size={20} />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="h-10 w-10"
                  onClick={() => handleSearch(searchQuery, 'music')}
                  disabled={isSearching || !searchQuery}
                >
                  <Icon name="Music" size={20} />
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto">
          {activeSection === 'home' && (
            <div className="max-w-6xl mx-auto p-6 space-y-8">
              {!hasSearched && (
                <>
                  <div className="text-center space-y-4 py-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4 animate-pulse">
                      <Icon name="Zap" size={40} className="text-primary" />
                    </div>
                    <h2 className="text-4xl font-bold text-foreground">
                      Добро пожаловать в SearchPro
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      Мощный браузер с реальным поиском, голосовым управлением и поиском музыки
                    </p>
                  </div>

                  <Tabs value={searchType} onValueChange={changeSearchType} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
                      {quickSearchModes.map((mode) => (
                        <TabsTrigger key={mode.id} value={mode.id} className="gap-2">
                          <Icon name={mode.icon as any} size={18} />
                          <span className="hidden sm:inline">{mode.label}</span>
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    <TabsContent value="web" className="mt-8">
                      <Card className="p-8 max-w-2xl mx-auto">
                        <h3 className="text-xl font-semibold mb-4 text-foreground">Текстовый поиск</h3>
                        <p className="text-muted-foreground mb-6">
                          Используй поисковую строку выше для реального поиска в интернете
                        </p>
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-foreground">Популярные запросы:</h4>
                          <div className="flex flex-wrap gap-2">
                            {['Новости', 'Погода', 'Курс валют', 'Python', 'JavaScript'].map((tag) => (
                              <Badge 
                                key={tag} 
                                variant="secondary" 
                                className="cursor-pointer hover:bg-accent"
                                onClick={() => {
                                  setSearchQuery(tag);
                                  handleSearch(tag, 'web');
                                }}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </Card>
                    </TabsContent>

                    <TabsContent value="voice" className="mt-8">
                      <Card className="p-8 max-w-2xl mx-auto text-center">
                        <div className={`inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full mb-6 ${isListening ? 'animate-pulse' : ''}`}>
                          <Icon name="Mic" size={48} className="text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-4 text-foreground">Голосовой поиск</h3>
                        <p className="text-muted-foreground mb-6">
                          {isListening ? 'Слушаю... Говорите!' : 'Нажми на кнопку и произнеси свой запрос'}
                        </p>
                        <Button
                          size="lg"
                          className="bg-primary hover:bg-primary/90"
                          onClick={handleVoiceSearch}
                          disabled={isListening}
                        >
                          {isListening ? 'Слушаю...' : 'Начать запись'}
                        </Button>
                      </Card>
                    </TabsContent>

                    <TabsContent value="image" className="mt-8">
                      <Card className="p-8 max-w-2xl mx-auto text-center">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-secondary/10 rounded-full mb-6">
                          <Icon name="Image" size={48} className="text-secondary" />
                        </div>
                        <h3 className="text-xl font-semibold mb-4 text-foreground">Поиск по фото</h3>
                        <p className="text-muted-foreground mb-6">
                          Загрузи изображение для поиска похожих картинок
                        </p>
                        <Button size="lg" variant="secondary" onClick={handleImageSearch}>
                          <Icon name="Upload" size={20} className="mr-2" />
                          Загрузить фото
                        </Button>
                      </Card>
                    </TabsContent>

                    <TabsContent value="music" className="mt-8">
                      <Card className="p-8 max-w-2xl mx-auto">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
                            <Icon name="Music" size={32} className="text-primary" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-foreground">Поиск музыки</h3>
                            <p className="text-sm text-muted-foreground">
                              Найди песню по описанию или настроению
                            </p>
                          </div>
                        </div>
                        <Input
                          placeholder="Например: энергичная рок-музыка 90-х"
                          className="mb-4"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleSearch(searchQuery, 'music');
                            }
                          }}
                        />
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-foreground">Примеры запросов:</h4>
                          <div className="flex flex-wrap gap-2">
                            {['Грустная музыка', 'Танцевальные хиты', 'Джаз', 'Рок 80-х', 'Поп'].map((tag) => (
                              <Badge 
                                key={tag} 
                                variant="outline" 
                                className="cursor-pointer hover:bg-accent"
                                onClick={() => {
                                  setSearchQuery(tag);
                                  handleSearch(tag, 'music');
                                }}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </>
              )}

              {hasSearched && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-foreground">
                      Результаты поиска: {searchQuery}
                    </h2>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setHasSearched(false);
                        setSearchResults([]);
                        setSearchQuery('');
                      }}
                    >
                      <Icon name="X" size={16} className="mr-2" />
                      Очистить
                    </Button>
                  </div>

                  {isSearching && (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 animate-spin">
                        <Icon name="Loader2" size={32} className="text-primary" />
                      </div>
                      <p className="text-muted-foreground">Ищем...</p>
                    </div>
                  )}

                  {!isSearching && searchResults.length === 0 && (
                    <Card className="p-8 text-center">
                      <Icon name="SearchX" size={48} className="text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Ничего не найдено</p>
                    </Card>
                  )}

                  {!isSearching && searchResults.length > 0 && (
                    <div className="space-y-4">
                      {searchResults.map((result, idx) => (
                        <Card key={idx} className="p-6 hover:bg-accent transition-colors">
                          <a 
                            href={result.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block space-y-2"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-primary hover:underline">
                                  {result.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {result.url}
                                </p>
                              </div>
                              <Badge variant="secondary">{result.source}</Badge>
                            </div>
                            <p className="text-foreground">
                              {result.snippet}
                            </p>
                            {result.thumbnail && (
                              <img 
                                src={result.thumbnail} 
                                alt={result.title}
                                className="w-full max-w-xs rounded-lg mt-4"
                              />
                            )}
                          </a>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeSection === 'bookmarks' && (
            <div className="max-w-4xl mx-auto p-6">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Закладки</h2>
              <div className="grid gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-4 hover:bg-accent transition-colors cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon name="Globe" size={24} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">Сохраненная страница {i}</h3>
                        <p className="text-sm text-muted-foreground">example{i}.com</p>
                      </div>
                      <Icon name="Star" size={20} className="text-primary" />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'history' && (
            <div className="max-w-4xl mx-auto p-6">
              <h2 className="text-2xl font-bold mb-6 text-foreground">История</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Сегодня</h3>
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3 p-3 hover:bg-accent rounded-lg transition-colors cursor-pointer">
                        <Icon name="Clock" size={16} className="text-muted-foreground" />
                        <span className="text-sm text-foreground">Посещенная страница {i}</span>
                        <span className="text-xs text-muted-foreground ml-auto">14:3{i}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'favorites' && (
            <div className="max-w-4xl mx-auto p-6">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Избранное</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="p-6 text-center hover:bg-accent transition-colors cursor-pointer">
                    <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <Icon name="Star" size={32} className="text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm text-foreground">Сайт {i}</h3>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="max-w-4xl mx-auto p-6">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Настройки</h2>
              <div className="space-y-4">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4 text-foreground">Общие настройки</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">Темная тема</span>
                      <Button variant="outline" size="sm">Вкл</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">Уведомления</span>
                      <Button variant="outline" size="sm">Вкл</Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
