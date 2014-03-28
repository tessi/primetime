require 'sinatra'
require './miller_rabin'

get '/' do
  t =Time.now; timestamp = t.to_i
  out = "<div id='timestamp'>#{timestamp} (#{t.to_s})</div>"
  if timestamp.prime? && timestamp.is_prime?
    out << "<div id='is_prime'>Yeah, PRIME TIME</div>"
  else
    t2 = timestamp
    t2 -= 1 if (t2 % 2 == 0)
    begin
      t2 += 2
    end while !t2.prime? && !t2.is_prime?
    diff = t2 - timestamp
    seconds = (diff % 60).to_s
    minutes = (diff / 60).to_s
    out << "<div id='not_prime'>next prime time in #{minutes} minutes and #{seconds} seconds</div>"
  end
end
